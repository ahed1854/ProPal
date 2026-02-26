import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    property_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
        required: true,
    },
    created_at: { type: Date, default: Date.now },
});

// Compound index to ensure unique favorites
favoriteSchema.index({ user_id: 1, property_id: 1 }, { unique: true });

export default mongoose.model("Favorite", favoriteSchema);
