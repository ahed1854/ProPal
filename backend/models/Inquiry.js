import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema({
    property_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
        required: true,
    },
    buyer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    seller_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    original_seller_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    message: { type: String, required: true },
    inquiry_type: {
        type: String,
        enum: ["information", "viewing", "offer"],
        default: "information",
    },
    status: {
        type: String,
        enum: ["pending_admin_review", "forwarded_to_seller", "admin_handling", "responded", "closed", "rejected"],
        default: "pending_admin_review",
    },
    contact_preference: {
        type: String,
        enum: ["email", "phone", "both"],
        default: "email",
    },
    admin_note: { type: String }, // Admin's internal notes
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    response_message: { type: String }, // Make sure this exists
    response_date: { type: Date }, // And this
    admin_note: { type: String }, // Internal notes
    note: { type: String }, // Alternative note field
});

export default mongoose.model("Inquiry", inquirySchema);
