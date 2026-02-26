import express from "express";
import Favorite from "../models/Favorite.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Get user's favorites
router.get("/", auth, async (req, res) => {
    try {
        const favorites = await Favorite.find({ user_id: req.user.userId }).populate("property_id").sort({ created_at: -1 });

        // Extract properties from favorites
        const favoriteProperties = favorites.map((fav) => fav.property_id);

        res.json({ success: true, data: favoriteProperties });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Add to favorites
router.post("/", auth, async (req, res) => {
    try {
        const { property_id } = req.body;

        // Check if already favorited
        const existingFavorite = await Favorite.findOne({
            user_id: req.user.userId,
            property_id,
        });

        if (existingFavorite) {
            return res.status(400).json({ success: false, error: "Property already in favorites" });
        }

        const favorite = new Favorite({
            user_id: req.user.userId,
            property_id,
        });

        await favorite.save();
        res.status(201).json({ success: true, data: favorite });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Remove from favorites
router.delete("/:propertyId", auth, async (req, res) => {
    try {
        const favorite = await Favorite.findOneAndDelete({
            user_id: req.user.userId,
            property_id: req.params.propertyId,
        });

        if (!favorite) {
            return res.status(404).json({ success: false, error: "Favorite not found" });
        }

        res.json({ success: true, message: "Removed from favorites" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Check if property is favorited
router.get("/check/:propertyId", auth, async (req, res) => {
    try {
        const favorite = await Favorite.findOne({
            user_id: req.user.userId,
            property_id: req.params.propertyId,
        });

        res.json({ success: true, isFavorited: !!favorite });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
