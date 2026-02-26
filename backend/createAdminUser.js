import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function createAdminUser() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/realestate_db");
        console.log("Connected to MongoDB");

        const User = mongoose.model(
            "User",
            new mongoose.Schema({
                email: String,
                password_hash: String,
                role: String,
                profile: Object,
                is_verified: Boolean,
                created_at: Date,
                updated_at: Date,
                last_login_at: Date,
            })
        );

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash("admin123", saltRounds);

        // Create admin user
        const adminUser = new User({
            email: "admin@realestate.com",
            password_hash: hashedPassword,
            role: "admin",
            profile: {
                first_name: "John",
                last_name: "Admin",
                phone_number: "+1234567890",
            },
            is_verified: true,
            created_at: new Date(),
            updated_at: new Date(),
            last_login_at: new Date(),
        });

        await adminUser.save();
        console.log("Admin user created successfully");
        process.exit(0);
    } catch (error) {
        console.error("Error creating admin user:", error);
        process.exit(1);
    }
}

createAdminUser();
