import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password_hash: { type: String, required: true },
    role: { type: String, enum: ["admin", "seller", "buyer"], required: true },
    profile: {
        first_name: String,
        last_name: String,
        phone_number: String,
        avatar_url: String,
    },
    is_verified: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    last_login_at: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);
