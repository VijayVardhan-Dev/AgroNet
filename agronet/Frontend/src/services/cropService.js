// Mock Crop Service

const MOCK_CROPS = [
    { id: 1, name: "Fresh Tomatoes", price: 40, farmerName: "Ramesh Kumar", location: "Nashik, MH", imageUrl: "https://placehold.co/400?text=Tomatoes", verified: true, category: "Vegetables" },
    { id: 2, name: "Wheat (Lokwan)", price: 25, farmerName: "Suresh Patil", location: "Pune, MH", imageUrl: "https://placehold.co/400?text=Wheat", verified: false, category: "Cereals" },
    { id: 3, name: "Alphonso Mangoes", price: 600, farmerName: "Ratnagiri Farms", location: "Ratnagiri, MH", imageUrl: "https://placehold.co/400?text=Mangoes", verified: true, category: "Fruits" },
    { id: 4, name: "Red Onions", price: 30, farmerName: "Kisan Mandi", location: "Nashik, MH", imageUrl: "https://placehold.co/400?text=Onions", verified: true, category: "Vegetables" },
    { id: 5, name: "Basmati Rice", price: 90, farmerName: "Punjab Agro", location: "Amritsar, PB", imageUrl: "https://placehold.co/400?text=Rice", verified: true, category: "Cereals" },
    { id: 6, name: "Turmeric", price: 200, farmerName: "Sangli Spices", location: "Sangli, MH", imageUrl: "https://placehold.co/400?text=Turmeric", verified: true, category: "Spices" },
];

export const addCrop = async (cropData) => {
    return new Promise((resolve) => {
        setTimeout(() => resolve({ id: Date.now(), ...cropData }), 500);
    });
};

export const getCrops = async () => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(MOCK_CROPS), 800);
    });
};
