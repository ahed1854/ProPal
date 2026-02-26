import React, { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";
import api from "../services/api";

const FavoritesContext = createContext();

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error("useFavorites must be used within a FavoritesProvider");
    }
    return context;
};

export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user, isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated && user?.role === "buyer") {
            loadFavorites();
        } else {
            setFavorites([]);
        }
    }, [isAuthenticated, user]);

    const loadFavorites = async () => {
        if (user?.role !== "buyer") return;

        setLoading(true);
        try {
            const response = await api.getFavorites();
            if (response.success) {
                setFavorites(response.data);
            }
        } catch (error) {
            console.error("Error loading favorites:", error);
        } finally {
            setLoading(false);
        }
    };

    const addToFavorites = async (propertyId) => {
        try {
            const response = await api.addToFavorites(propertyId);
            if (response.success) {
                await loadFavorites(); // Reload favorites
                return { success: true };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const removeFromFavorites = async (propertyId) => {
        try {
            const response = await api.removeFromFavorites(propertyId);
            if (response.success) {
                await loadFavorites(); // Reload favorites
                return { success: true };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const isPropertyFavorited = (propertyId) => {
        return favorites.some((fav) => fav._id === propertyId || fav._id?.$oid === propertyId);
    };

    const toggleFavorite = async (propertyId) => {
        if (isPropertyFavorited(propertyId)) {
            return await removeFromFavorites(propertyId);
        } else {
            return await addToFavorites(propertyId);
        }
    };

    const value = {
        favorites,
        loading,
        addToFavorites,
        removeFromFavorites,
        toggleFavorite,
        isPropertyFavorited,
        loadFavorites,
    };

    return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};
