import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
    try {
        const { email, password, role, profile } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, error: "User already exists" });
        }

        // Hash password
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);

        // Create user
        const user = new User({
            email,
            password_hash,
            role,
            profile,
        });

        await user.save();

        res.status(201).json({ success: true, message: "User created successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, error: "Invalid credentials" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ success: false, error: "Invalid credentials" });
        }

        // Update last login
        user.last_login_at = new Date();
        await user.save();

        // Create JWT token
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET || "your-secret-key", { expiresIn: "7d" });

        // Return user data (without password)
        const userData = {
            _id: user._id,
            email: user.email,
            role: user.role,
            profile: user.profile,
            is_verified: user.is_verified,
        };

        res.json({ success: true, user: userData, token });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
