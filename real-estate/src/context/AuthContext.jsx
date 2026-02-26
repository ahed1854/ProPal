// import React, { createContext, useState, useContext, useEffect } from "react";
// import api from "../services/api";

// const AuthContext = createContext();

// export const useAuth = () => {
//     const context = useContext(AuthContext);
//     if (!context) {
//         throw new Error("useAuth must be used within an AuthProvider");
//     }
//     return context;
// };

// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const token = localStorage.getItem("realestate_token");
//         const userData = localStorage.getItem("realestate_user");

//         if (token && userData) {
//             try {
//                 setUser(JSON.parse(userData));
//                 // Verify token is still valid
//                 api.getProfile().catch(() => {
//                     logout();
//                 });
//             } catch (error) {
//                 console.error("Error parsing user data:", error);
//                 localStorage.removeItem("realestate_token");
//                 localStorage.removeItem("realestate_user");
//             }
//         }
//         setLoading(false);
//     }, []);

//     const login = async (email, password) => {
//         try {
//             const response = await api.login(email, password);
//             if (response.success) {
//                 setUser(response.user);
//                 localStorage.setItem("realestate_token", response.token);
//                 localStorage.setItem("realestate_user", JSON.stringify(response.user));
//                 return { success: true };
//             }
//         } catch (error) {
//             return { success: false, error: error.message };
//         }
//     };

//     const register = async (userData) => {
//         try {
//             const response = await api.register(userData);
//             if (response.success) {
//                 return { success: true };
//             }
//         } catch (error) {
//             return { success: false, error: error.message };
//         }
//     };

//     const logout = () => {
//         setUser(null);
//         localStorage.removeItem("realestate_token");
//         localStorage.removeItem("realestate_user");
//         window.location.href = "/";
//     };

//     const value = {
//         user,
//         login,
//         register,
//         logout,
//         loading,
//         isAuthenticated: !!user,
//         isAdmin: user?.role === "admin",
//         isSeller: user?.role === "seller",
//         isBuyer: user?.role === "buyer",
//     };

//     return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkUserLoggedIn();
    }, []);

    const checkUserLoggedIn = async () => {
        try {
            const token = localStorage.getItem("token");
            if (token) {
                const response = await api.getProfile();
                if (response.success) {
                    setUser({ ...response.data, token });
                } else {
                    localStorage.removeItem("token");
                    setUser(null);
                }
            }
        } catch (error) {
            console.error("Auth check failed:", error);
            localStorage.removeItem("token");
            setUser(null);
        }
        setLoading(false);
    };

    const login = async (email, password) => {
        // ERROR WAS HERE: Do NOT use JSON.stringify()
        // Axios handles the JSON conversion automatically
        const response = await api.login({ email, password });

        if (response.success) {
            localStorage.setItem("token", response.token);
            setUser({ ...response.user, token: response.token });
            return { success: true };
        }
        return { success: false, error: response.error };
    };

    const register = async (userData) => {
        // ERROR WAS HERE: Do NOT use JSON.stringify()
        const response = await api.register(userData);

        if (response.success) {
            localStorage.setItem("token", response.token);
            setUser({ ...response.user, token: response.token });
            return { success: true };
        }
        return { success: false, error: response.error };
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    const value = {
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
