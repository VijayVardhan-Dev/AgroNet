// Mock Auth Service
export const login = async (email, password) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (password === "password") { // Simple validation mock
                resolve({ user: { email, displayName: "Test User" } });
            } else {
                reject(new Error("Invalid credentials (use 'password')"));
            }
        }, 500);
    });
};

export const register = async (email, password, name) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ user: { email, displayName: name } });
        }, 500);
    });
};

export const logout = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 200);
    });
};
