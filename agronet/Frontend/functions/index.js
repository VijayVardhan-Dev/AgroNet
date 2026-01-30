const functions = require('firebase-functions');
const admin = require('firebase-admin');
const geofire = require('geofire-common');
admin.initializeApp();

exports.dispatchOrder = functions.firestore
    .document('deliveries/{deliveryId}') // Changed 'orders' to 'deliveries' to match our schema
    .onCreate(async (snap, context) => {
        const delivery = snap.data();

        // 1. Get Pickup Location
        if (!delivery.pickupLocation || !delivery.pickupLocation.lat || !delivery.pickupLocation.lng) {
            console.log("No pickup location defined for delivery:", context.params.deliveryId);
            return;
        }

        const center = [delivery.pickupLocation.lat, delivery.pickupLocation.lng];
        const radiusInM = 5000; // 5km Radius

        // 2. Calculate GeoQueries (This is the magic math)
        const bounds = geofire.geohashQueryBounds(center, radiusInM);
        const promises = [];

        // 3. Search the 'users' collection for Drivers in these bounds
        for (const b of bounds) {
            const q = admin.firestore().collection('users')
                .where('roles.isDriver', '==', true)
                .where('location.geohash', '>=', b[0])
                .where('location.geohash', '<=', b[1]);
            promises.push(q.get());
        }

        const snapshots = await Promise.all(promises);
        const matchingTokens = [];

        // 4. Filter Exact Distance & Collect Tokens
        for (const snap of snapshots) {
            for (const doc of snap.docs) {
                const driver = doc.data();
                if (!driver.location) continue;

                const lat = driver.location.lat;
                const lng = driver.location.lng;

                // Double check distance (GeoHash is a square, radius is a circle)
                const distanceInKm = geofire.distanceBetween(center, [lat, lng]);
                if (distanceInKm <= 5 && driver.fcmToken) {
                    matchingTokens.push(driver.fcmToken);
                }
            }
        }

        if (matchingTokens.length === 0) return console.log("No drivers nearby");

        // 5. Send Notification
        const payload = {
            notification: {
                title: 'New Delivery Request!',
                body: `Pickup within 5km.`,
            },
            data: {
                deliveryId: context.params.deliveryId, // Changed orderId to deliveryId
                click_action: 'FLUTTER_NOTIFICATION_CLICK'
            }
        };

        return admin.messaging().sendToDevice(matchingTokens, payload);
    });
