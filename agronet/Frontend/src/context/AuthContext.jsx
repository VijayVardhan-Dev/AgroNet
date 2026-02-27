import { createContext, useContext, useState, useEffect } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../lib/firebase";
import { getUserProfile, createUserProfile } from "../services/userService";

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const refreshUserProfile = async (uid = auth.currentUser?.uid) => {
        if (!uid) {
            setUserProfile(null);
            return null;
        }

        try {
            const profile = await getUserProfile(uid);
            setUserProfile(profile || null);
            return profile || null;
        } catch (error) {
            console.error("Error refreshing user profile:", error);
            return null;
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                await refreshUserProfile(currentUser.uid);
            } else {
                setUserProfile(null);
            }
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const signup = async (email, password, fullName) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Create initial user profile in Firestore
        await createUserProfile(userCredential.user.uid, {
            email,
            fullName,
            roles: { isBuyer: true, isFarmer: false } // Default roles
        });
        return userCredential;
    };

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const googleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        const userCredential = await signInWithPopup(auth, provider);
        // Check if user exists, if not create
        const profile = await getUserProfile(userCredential.user.uid);
        if (!profile) {
            await createUserProfile(userCredential.user.uid, {
                email: userCredential.user.email,
                fullName: userCredential.user.displayName,
                profilePic: userCredential.user.photoURL,
                roles: { isBuyer: true, isFarmer: false }
            });
        }
        return userCredential;
    };

    const logout = () => {
        return signOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user, userProfile, loading, signup, login, googleSignIn, logout, refreshUserProfile }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
