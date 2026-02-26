import React, { createContext, useState, useContext } from "react";

const PropertyContext = createContext();

export const useProperty = () => {
    const context = useContext(PropertyContext);
    if (!context) {
        throw new Error("useProperty must be used within a PropertyProvider");
    }
    return context;
};

export const PropertyProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);
    const [recentViews, setRecentViews] = useState([]);

    const addToFavorites = async (propertyId) => {
        // Implementation for adding to favorites
    };

    const logPropertyView = async (propertyId) => {
        // Implementation for logging property views
    };

    const value = {
        favorites,
        recentViews,
        addToFavorites,
        logPropertyView,
    };

    return <PropertyContext.Provider value={value}>{children}</PropertyContext.Provider>;
};
