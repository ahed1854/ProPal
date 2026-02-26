import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    property_type: { type: String, enum: ["apartment", "house", "condo", "villa"], required: true },
    transaction_type: { type: String, enum: ["sale", "rent"], required: true },
    price: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    address: {
        street: String,
        city: String,
        state: String,
        zip_code: String,
        country: { type: String, default: "USA" },
        coordinates: {
            type: { type: String, default: "Point" },
            coordinates: { type: [Number], default: [0, 0] },
        },
    },
    details: {
        bedrooms: Number,
        bathrooms: Number,
        area_sqft: Number,
        year_built: Number,
        lot_size: Number,
        parking_spaces: Number,
        has_garage: Boolean,
    },
    features: [String],
    amenities: [String],
    images: [
        {
            url: { type: String, required: true },
            caption: { type: String, default: "Property Image" },
            is_primary: { type: Boolean, default: false },
            order: { type: Number, default: 0 },
            created_at: { type: Date, default: Date.now },
        },
    ],
    seller_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    approved_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    approved_at: Date,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

export default mongoose.model("Property", propertySchema);
