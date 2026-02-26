// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";
// import authRoutes from "./routes/auth.js";
// import propertyRoutes from "./routes/properties.js";
// import userRoutes from "./routes/users.js";
// import favoriteRoutes from "./routes/favorites.js";
// import inquiryRoutes from "./routes/inquiries.js";

// dotenv.config();

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // MongoDB Connection
// const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/realestate_db";
// mongoose
//     .connect(MONGODB_URI)
//     .then(() => console.log("Connected to MongoDB"))
//     .catch((err) => console.error("MongoDB connection error:", err));

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/properties", propertyRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/favorites", favoriteRoutes);
// app.use("/api/inquiries", inquiryRoutes);

// // Health check
// app.get("/api/health", (req, res) => {
//     res.json({ status: "OK", message: "RealEstate API is running" });
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path"; // Import path
import { fileURLToPath } from "url"; // Import for ES modules

import authRoutes from "./routes/auth.js";
import propertyRoutes from "./routes/properties.js";
import userRoutes from "./routes/users.js";
import favoriteRoutes from "./routes/favorites.js";
import inquiryRoutes from "./routes/inquiries.js";

dotenv.config();

// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve Static Files (Images)
// This makes http://localhost:5000/uploads/filename.jpg accessible
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/realestate_db";
mongoose
    .connect(MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/users", userRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/inquiries", inquiryRoutes);

// Health check
app.get("/api/health", (req, res) => {
    res.json({ status: "OK", message: "RealEstate API is running" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
