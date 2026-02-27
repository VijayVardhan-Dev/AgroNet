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

    if (!userProfile) return <div>Loading profile...</div>;

    return (
        <div className="p-4">
            <h1>User Profile</h1>
            <div>
                <img src={formData.profilePic || "https://placehold.co/150"} alt="Profile" style={{ width: 100, height: 100, borderRadius: '50%' }} />
                {isEditing && (
                    <div>
                        <label>Profile Pic URL:</label>
                        <input
                            type="text"
                            value={formData.profilePic || ""}
                            onChange={(e) => setFormData({ ...formData, profilePic: e.target.value })}
                        />
                    </div>
                )}
            </div>

            <div>
                <p><strong>Name:</strong> {isEditing ? <input value={formData.fullName || ""} onChange={e => setFormData({ ...formData, fullName: e.target.value })} /> : formData.fullName}</p>
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>Phone:</strong> {isEditing ? <input value={formData.phone || ""} onChange={e => setFormData({ ...formData, phone: e.target.value })} /> : formData.phone}</p>
                <p><strong>Address:</strong> {isEditing ? <input value={formData.location?.address || ""} onChange={e => setFormData({ ...formData, location: { ...formData.location, address: e.target.value } })} /> : formData.location?.address}</p>
            </div>

            <div style={{ marginTop: 20 }}>
                <h3>Roles</h3>
                <label>
                    <input
                        type="checkbox"
                        checked={formData.roles?.isFarmer || false}
                        onChange={() => isEditing && toggleRole('isFarmer')}
                        disabled={!isEditing}
                    />
                    Farmer
                </label>
                <label style={{ marginLeft: 15 }}>
                    <input
                        type="checkbox"
                        checked={formData.roles?.isBuyer || false}
                        onChange={() => isEditing && toggleRole('isBuyer')}
                        disabled={!isEditing}
                    />
                    Buyer
                </label>
                <label style={{ marginLeft: 15 }}>
                    <input
                        type="checkbox"
                        checked={formData.roles?.isDriver || false}
                        onChange={() => isEditing && toggleRole('isDriver')}
                        disabled={!isEditing}
                    />
                    Driver
                </label>
            </div>

            <div style={{ marginTop: 20 }}>
                {isEditing ? (
                    <>
                        <button onClick={handleSave}>Save Changes</button>
                        <button onClick={() => setIsEditing(false)} style={{ marginLeft: 10 }}>Cancel</button>
                    </>
                ) : (
                    <button onClick={() => setIsEditing(true)}>Edit Profile</button>
                )}
                <button onClick={logout} style={{ marginLeft: 20, color: 'red' }}>Logout</button>
            </div>

            <div style={{ marginTop: 20, borderTop: '1px solid #eee', paddingTop: 20 }}>
                <h3>Quick Links</h3>
                <div style={{ display: 'flex', gap: 10 }}>
                    <a href="/orders" style={{ textDecoration: 'none', color: 'blue' }}>View My Orders</a>
                    {formData.roles?.isDriver && (
                        <a href="/deliveries" style={{ textDecoration: 'none', color: 'blue' }}>Driver Dashboard</a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
