const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE}/api/upload`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Image upload failed');
    }

    const data = await response.json();
    return data.url; // Returns the Cloudinary secure URL
};
