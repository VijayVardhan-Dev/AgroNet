import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { updateUserProfile } from "../services/userService";
import { 
    ShoppingBag, Bell, Heart, 
    LayoutDashboard, Truck, HelpCircle, MessageSquare, LogOut, ChevronRight 
} from "lucide-react";
import { ROUTES } from "../routing/routes";

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

    const navLinks = [
        { to: ROUTES.ORDERS, icon: ShoppingBag, label: "My Orders" },
        { to: ROUTES.WISHLIST, icon: Heart, label: "Wishlist" },
        { to: ROUTES.NOTIFICATIONS, icon: Bell, label: "Notifications" },
        { to: ROUTES.FARMER_DASHBOARD, icon: LayoutDashboard, label: "Farmer Dashboard" },
        { to: ROUTES.DELIVERIES, icon: Truck, label: "Deliveries" },
    ];

    const secondaryLinks = [
        { to: ROUTES.FEEDBACK, icon: MessageSquare, label: "Feedback" },
        { to: ROUTES.HELP, icon: HelpCircle, label: "Help & Support" },
    ];

    return (
        <div className="p-4 bg-white min-h-screen font-sans pb-32">
            <div className="space-y-10">
                {/* Profile Picture Section */}
                <div className="flex items-start space-x-6 pb-6 border-b border-gray-100">
                    <img 
                        src={formData.profilePic || user?.photoURL || "https://placehold.co/150"} 
                        alt="Profile" 
                        className="w-24 h-24 rounded-full object-cover border border-gray-200 shadow-sm"
                    />
                    {!isEditing && (
                        <div className="flex flex-col justify-center h-24">
                            <h2 className="text-2xl font-medium text-gray-900">{formData.fullName || "User"}</h2>
                            <p className="text-gray-500 mt-1">{formData.email}</p>
                        </div>
                    )}
                </div>

                {/* Mobile Navigation Links — above personal info */}
                <div className="md:hidden">
                    <div className="space-y-1">
                        {navLinks.map(link => {
                            const Icon = link.icon;
                            return (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className="flex items-center justify-between px-4 py-3.5 rounded-xl text-slate-700 hover:bg-gray-50 transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon size={20} className="text-slate-500 group-hover:text-slate-700" />
                                        <span className="text-sm font-medium">{link.label}</span>
                                    </div>
                                    <ChevronRight size={16} className="text-slate-300" />
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Profile Photo Edit (only in editing mode) */}
                {isEditing && (
                    <div className="pb-10 border-b border-gray-100">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo URL</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-black focus:border-black transition-all outline-none"
                            value={formData.profilePic || ""}
                            onChange={(e) => setFormData({ ...formData, profilePic: e.target.value })}
                            placeholder="https://..."
                        />
                    </div>
                )}

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

                {/* Feedback & Help — at the bottom */}
                <div className="pt-6 border-t border-gray-100 md:hidden">
                    <div className="space-y-1">
                        {secondaryLinks.map(link => {
                            const Icon = link.icon;
                            return (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className="flex items-center justify-between px-4 py-3.5 rounded-xl text-slate-700 hover:bg-gray-50 transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon size={20} className="text-slate-500 group-hover:text-slate-700" />
                                        <span className="text-sm font-medium">{link.label}</span>
                                    </div>
                                    <ChevronRight size={16} className="text-slate-300" />
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Logout */}
                <div className="pt-6 border-t border-gray-100">
                    <button 
                        onClick={logout} 
                        className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors w-full md:w-auto"
                    >
                        <LogOut size={20} />
                        <span className="text-sm font-medium">Log Out</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
