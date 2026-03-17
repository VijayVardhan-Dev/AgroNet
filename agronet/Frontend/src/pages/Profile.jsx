import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { updateUserProfile } from "../services/userService";

const Profile = () => {
    const { user, userProfile, logout, refreshUserProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (userProfile) {
            setFormData(userProfile);
        }
    }, [userProfile]);

    const handleSave = async () => {
        try {
            await updateUserProfile(user.uid, formData);
            await refreshUserProfile(user.uid);
            setIsEditing(false);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to update profile.");
        }
    };

    const toggleRole = (role) => {
        setFormData(prev => ({
            ...prev,
            roles: {
                ...prev.roles,
                [role]: !prev.roles?.[role]
            }
        }));
    };

    if (!userProfile) return (
        <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="text-gray-500 text-lg">Loading profile...</div>
        </div>
    );

    return (
        <div className="p-4 bg-white min-h-screen font-sans">
            {/* <div className="flex justify-between items-center mb-10">
                <h1 className="text-3xl  text-gray-900 tracking-tight">Profile</h1>
                <button 
                    onClick={logout} 
                    className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                >
                    Logout
                </button>
            </div> */}

            <div className="space-y-10">
                {/* Profile Picture Section */}
                <div className="flex items-start space-x-6 pb-10 border-b border-gray-100">
                    <img 
                        src={formData.profilePic || user?.photoURL || "https://placehold.co/150"} 
                        alt="Profile" 
                        className="w-24 h-24 rounded-full object-cover border border-gray-200 shadow-sm"
                    />
                    {isEditing ? (
                        <div className="flex-1 max-w-md">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo URL</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-black focus:border-black transition-all outline-none"
                                value={formData.profilePic || ""}
                                onChange={(e) => setFormData({ ...formData, profilePic: e.target.value })}
                                placeholder="https://..."
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col justify-center h-24">
                            <h2 className="text-2xl font-medium text-gray-900">{formData.fullName || "User"}</h2>
                            <p className="text-gray-500 mt-1">{formData.email}</p>
                        </div>
                    )}
                </div>

                {/* Personal Information */}
                <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-5">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-2">Full Name</label>
                            {isEditing ? (
                                <input 
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-black focus:border-black transition-all outline-none"
                                    value={formData.fullName || ""} 
                                    onChange={e => setFormData({ ...formData, fullName: e.target.value })} 
                                />
                            ) : (
                                <p className="text-gray-900 font-medium">{formData.fullName || "—"}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-2">Email Address</label>
                            <p className="text-gray-900 font-medium py-2">{formData.email}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-2">Phone Number</label>
                            {isEditing ? (
                                <input 
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-black focus:border-black transition-all outline-none"
                                    value={formData.phone || ""} 
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })} 
                                />
                            ) : (
                                <p className="text-gray-900 font-medium">{formData.phone || "—"}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-2">Address</label>
                            {isEditing ? (
                                <input 
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-black focus:border-black transition-all outline-none"
                                    value={formData.location?.address || ""} 
                                    onChange={e => setFormData({ ...formData, location: { ...formData.location, address: e.target.value } })} 
                                />
                            ) : (
                                <p className="text-gray-900 font-medium">{formData.location?.address || "—"}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Roles */}
                <div className="pt-10 border-t border-gray-100">
                    <h3 className="text-lg font-medium text-gray-900 mb-5">Roles & Permissions</h3>
                    <div className="flex flex-wrap gap-4">
                        <label className={`flex items-center px-5 py-3 rounded-md border transition-all ${!isEditing ? 'cursor-default opacity-90' : 'cursor-pointer hover:border-gray-400'} ${formData.roles?.isFarmer ? 'border-gray-900 bg-gray-50' : 'border-gray-200 bg-white'}`}>
                            <input
                                type="checkbox"
                                className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                                checked={formData.roles?.isFarmer || false}
                                onChange={() => isEditing && toggleRole('isFarmer')}
                                disabled={!isEditing}
                            />
                            <span className="ml-3 font-medium text-gray-900">Farmer</span>
                        </label>

                        <label className={`flex items-center px-5 py-3 rounded-md border transition-all ${!isEditing ? 'cursor-default opacity-90' : 'cursor-pointer hover:border-gray-400'} ${formData.roles?.isBuyer ? 'border-gray-900 bg-gray-50' : 'border-gray-200 bg-white'}`}>
                            <input
                                type="checkbox"
                                className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                                checked={formData.roles?.isBuyer || false}
                                onChange={() => isEditing && toggleRole('isBuyer')}
                                disabled={!isEditing}
                            />
                            <span className="ml-3 font-medium text-gray-900">Buyer</span>
                        </label>

                        <label className={`flex items-center px-5 py-3 rounded-md border transition-all ${!isEditing ? 'cursor-default opacity-90' : 'cursor-pointer hover:border-gray-400'} ${formData.roles?.isDriver ? 'border-gray-900 bg-gray-50' : 'border-gray-200 bg-white'}`}>
                            <input
                                type="checkbox"
                                className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                                checked={formData.roles?.isDriver || false}
                                onChange={() => isEditing && toggleRole('isDriver')}
                                disabled={!isEditing}
                            />
                            <span className="ml-3 font-medium text-gray-900">Driver</span>
                        </label>
                    </div>
                </div>

                {/* Actions */}
                <div className="pt-10 border-t border-gray-100 flex gap-4">
                    {isEditing ? (
                        <>
                            <button 
                                onClick={handleSave}
                                className="px-6 py-2.5 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition-colors shadow-sm"
                            >
                                Save Changes
                            </button>
                            <button 
                                onClick={() => {
                                    setFormData(userProfile);
                                    setIsEditing(false);
                                }}
                                className="px-6 py-2.5 bg-white text-gray-700 font-medium rounded-md border border-gray-300 hover:bg-gray-50 transition-colors shadow-sm"
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button 
                            onClick={() => setIsEditing(true)}
                            className="px-6 py-2.5 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition-colors shadow-sm"
                        >
                            Edit Profile
                        </button>
                    )}
                </div>

                {/* Quick Links */}
                <div className="pt-10 border-t border-gray-100">
                    <h3 className="text-lg font-medium text-gray-900 mb-5">Quick Links</h3>
                    <div className="flex gap-4">
                        <a 
                            href="/orders" 
                            className="inline-flex items-center px-5 py-3 bg-white hover:bg-gray-50 text-gray-900 font-medium rounded-md transition-colors border border-gray-200 shadow-sm"
                        >
                            View My Orders
                        </a>
                        {formData.roles?.isDriver && (
                            <a 
                                href="/deliveries" 
                                className="inline-flex items-center px-5 py-3 bg-white hover:bg-gray-50 text-gray-900 font-medium rounded-md transition-colors border border-gray-200 shadow-sm"
                            >
                                Driver Dashboard
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
