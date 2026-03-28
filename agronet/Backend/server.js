const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const admin = require('firebase-admin');
const geofire = require('geofire-common');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

dotenv.config();

// --- Cloudinary Setup ---
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dz9aw5ik6',
    api_key: process.env.CLOUDINARY_API_KEY || '216384382679428',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'arv_zdlCkOQSqaK4IpzqXu7XYqQ',
});

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

// --- Firebase Admin Setup ---
try {
    // Check if SERVICE_ACCOUNT_KEY is in env or just try default
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
        ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
        : require('./serviceAccountKey.json'); // User needs to add this file

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    console.log("Firebase Admin Initialized");
} catch (error) {
    console.warn("Firebase Admin Initialization Failed. Dispatcher will not work until credentials are fixed.");
    console.warn("Error:", error.message);
}

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// --- Delivery Dispatcher Logic ---
const startDeliveryDispatcher = () => {
    if (admin.apps.length === 0) return;

    const db = admin.firestore();

    // Listen for NEW deliveries that are searching for a driver
    // We use onSnapshot to simulate the 'onCreate' trigger
    db.collection('deliveries')
        .where('status', '==', 'SEARCHING_DRIVER')
        .onSnapshot((snapshot) => {
            snapshot.docChanges().forEach(async (change) => {
                if (change.type === 'added') {
                    const delivery = change.doc.data();
                    const deliveryId = change.doc.id;
                    console.log(`New Delivery Request: ${deliveryId}`);

                    if (!delivery.pickupLocation?.lat || !delivery.pickupLocation?.lng) {
                        console.log("No pickup location for delivery", deliveryId);
                        return;
                    }

                    await findAndNotifyDrivers(delivery, deliveryId, db);
                }
            });
        }, (error) => {
            console.error("Dispatcher Error:", error);
        });
};

const findAndNotifyDrivers = async (delivery, deliveryId, db) => {
    const center = [delivery.pickupLocation.lat, delivery.pickupLocation.lng];
    const radiusInM = 5000; // 5km

    const bounds = geofire.geohashQueryBounds(center, radiusInM);
    const promises = [];

    for (const b of bounds) {
        const q = db.collection('users')
            .where('roles.isDriver', '==', true)
            .where('location.geohash', '>=', b[0])
            .where('location.geohash', '<=', b[1]);
        promises.push(q.get());
    }

    const snapshots = await Promise.all(promises);
    const matchingTokens = [];

    for (const snap of snapshots) {
        for (const doc of snap.docs) {
            const driver = doc.data();
            if (!driver.location) continue;

            const lat = driver.location.lat;
            const lng = driver.location.lng;

            // Precise distance check
            const distanceInKm = geofire.distanceBetween(center, [lat, lng]);
            if (distanceInKm <= 5 && driver.fcmToken) {
                matchingTokens.push(driver.fcmToken);
            }
        }
    }

    if (matchingTokens.length === 0) {
        console.log(`No drivers found for ${deliveryId}`);
        return;
    }

    const payload = {
        notification: {
            title: 'New Delivery Request!',
            body: `Pickup within 5km.`,
        },
        data: {
            deliveryId: deliveryId,
            click_action: 'FLUTTER_NOTIFICATION_CLICK' // Or your web app logic
        }
    };

    try {
        await admin.messaging().sendToDevice(matchingTokens, payload);
        console.log(`Notified ${matchingTokens.length} drivers for delivery ${deliveryId}`);
    } catch (error) {
        console.error("FCM Send Error:", error);
    }
};

// Start the watcher
startDeliveryDispatcher();

// --- Routes ---
app.get('/', (req, res) => {
    res.send('AgroNet Backend is Running');
});

// --- Image Upload Route ---
app.post('/api/upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        // Upload buffer to Cloudinary
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: 'agronet',
                    resource_type: 'image',
                    transformation: [
                        { width: 800, height: 800, crop: 'limit', quality: 'auto' }
                    ]
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            stream.end(req.file.buffer);
        });

        res.json({
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
        });
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ error: 'Image upload failed' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});