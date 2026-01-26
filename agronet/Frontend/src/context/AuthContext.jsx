import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    // Mock login state. Change to true to simulate logged in user.
    const [user, setUser] = useState(null);
    const [loading] = useState(false); // Removed unused setLoading

    const login = (email) => {
        setUser({ email, displayName: "Test User" });
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
