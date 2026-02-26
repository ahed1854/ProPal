// import express from "express";
// import Property from "../models/Property.js";
// import auth from "../middleware/auth.js";
// import upload from "../middleware/upload.js";

// const router = express.Router();

// // Get all properties with filtering
// // router.get("/", async (req, res) => {
// //     try {
// //         const { status, seller_id, city, property_type, transaction_type, min_price, max_price } = req.query;

// //         let filter = {};

// //         if (status) filter.status = status;
// //         if (seller_id) filter.seller_id = seller_id;
// //         if (city) filter["address.city"] = new RegExp(city, "i");
// //         if (property_type) filter.property_type = property_type;
// //         if (transaction_type) filter.transaction_type = transaction_type;
// //         if (min_price || max_price) {
// //             filter.price = {};
// //             if (min_price) filter.price.$gte = parseInt(min_price);
// //             if (max_price) filter.price.$lte = parseInt(max_price);
// //         }

// //         const properties = await Property.find(filter).populate("seller_id", "profile").populate("approved_by", "profile").sort({ created_at: -1 });

// //         res.json({ success: true, data: properties });
// //     } catch (error) {
// //         res.status(500).json({ success: false, error: error.message });
// //     }
// // });

// router.post("/", auth, upload.array("propertyImages", 10), async (req, res) => {
//     try {
//         if (req.user.role !== "seller") {
//             return res.status(403).json({ success: false, error: "Access denied" });
//         }

//         // When using FormData, nested objects (address, details) come as JSON strings
//         // We need to parse them back into objects
//         let address = req.body.address;
//         let details = req.body.details;
//         let features = req.body.features;
//         let amenities = req.body.amenities;

//         // Check if they are strings (FormData) and parse them
//         if (typeof address === "string") address = JSON.parse(address);
//         if (typeof details === "string") details = JSON.parse(details);
//         if (typeof features === "string") features = JSON.parse(features);
//         if (typeof amenities === "string") amenities = JSON.parse(amenities);

//         // Process uploaded files
//         const imageFiles = req.files;

//         // Also get captions if they were sent (as an array of strings)
//         // Note: Handling specific captions for specific files in FormData is tricky.
//         // For simplicity, we will map files to the images array.
//         // If you sent image metadata as a JSON string string, parse it:
//         let imageMetadata = req.body.imageMetadata ? JSON.parse(req.body.imageMetadata) : [];

//         // Construct the images array for MongoDB
//         const images = imageFiles.map((file, index) => {
//             // Find corresponding metadata or default
//             // This assumes the frontend sends files and metadata in the same order
//             const meta = imageMetadata[index] || {};

//             // Construct the full URL relative to server
//             // Windows uses backslashes, replace them with forward slashes for URLs
//             const urlPath = `/uploads/${file.filename}`;

//             return {
//                 url: urlPath,
//                 caption: meta.caption || "Property Image",
//                 is_primary: index === 0, // First image is primary by default
//                 order: index,
//             };
//         });

//         const propertyData = {
//             ...req.body,
//             address,
//             details,
//             features,
//             amenities,
//             images: images, // Use the processed images
//             seller_id: req.user.userId,
//         };

//         const property = new Property(propertyData);
//         await property.save();

//         await property.populate("seller_id", "profile");

//         res.status(201).json({ success: true, data: property });
//     } catch (error) {
//         console.error("Create property error:", error);
//         res.status(500).json({ success: false, error: error.message });
//     }
// });

// // Get single property
// router.get("/:id", async (req, res) => {
//     try {
//         const property = await Property.findById(req.params.id).populate("seller_id", "profile").populate("approved_by", "profile");

//         if (!property) {
//             return res.status(404).json({ success: false, error: "Property not found" });
//         }

//         res.json({ success: true, data: property });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// });

// // Create property (seller only)
// router.post("/", auth, async (req, res) => {
//     try {
//         if (req.user.role !== "seller") {
//             return res.status(403).json({ success: false, error: "Access denied" });
//         }

//         const propertyData = {
//             ...req.body,
//             seller_id: req.user.userId,
//         };

//         const property = new Property(propertyData);
//         await property.save();

//         // Populate the seller info for response
//         await property.populate("seller_id", "profile");

//         res.status(201).json({ success: true, data: property });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// });

// // Update property status (admin only)
// router.patch("/:id/status", auth, async (req, res) => {
//     try {
//         if (req.user.role !== "admin") {
//             return res.status(403).json({ success: false, error: "Access denied" });
//         }

//         const { status } = req.body;
//         const property = await Property.findById(req.params.id);

//         if (!property) {
//             return res.status(404).json({ success: false, error: "Property not found" });
//         }

//         property.status = status;
//         property.approved_by = req.user.userId;
//         property.approved_at = new Date();
//         await property.save();

//         res.json({ success: true, data: property });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// });

// export default router;

import express from "express";
import Property from "../models/Property.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/upload.js"; // Import upload middleware

const router = express.Router();

// 1. GET ALL PROPERTIES (Public)
router.get("/", async (req, res) => {
    try {
        const { status, seller_id, city, property_type, transaction_type, min_price, max_price } = req.query;

        let filter = {};

        if (status) filter.status = status;
        if (seller_id) filter.seller_id = seller_id;
        if (city) filter["address.city"] = new RegExp(city, "i");
        if (property_type) filter.property_type = property_type;
        if (transaction_type) filter.transaction_type = transaction_type;
        if (min_price || max_price) {
            filter.price = {};
            if (min_price) filter.price.$gte = parseInt(min_price);
            if (max_price) filter.price.$lte = parseInt(max_price);
        }

        // Fetch properties
        const properties = await Property.find(filter).populate("seller_id", "profile").populate("approved_by", "profile").sort({ created_at: -1 });

        res.json({ success: true, data: properties });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 2. GET SINGLE PROPERTY (Public)
router.get("/:id", async (req, res) => {
    try {
        const property = await Property.findById(req.params.id).populate("seller_id", "profile").populate("approved_by", "profile");

        if (!property) {
            return res.status(404).json({ success: false, error: "Property not found" });
        }

        res.json({ success: true, data: property });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 3. CREATE PROPERTY (Seller Only - with Image Upload)
// 3. CREATE PROPERTY (Seller Only - with Image Upload)
router.post("/", auth, upload.array("propertyImages", 10), async (req, res) => {
    try {
        if (req.user.role !== "seller") {
            return res.status(403).json({ success: false, error: "Access denied" });
        }

        // SAFETY CHECK: Ensure files exist
        const imageFiles = req.files || [];

        if (imageFiles.length === 0) {
            // Optional: Return error if images are strictly required
            // return res.status(400).json({ success: false, error: "No images uploaded" });
        }

        // Parse nested objects (Handle FormData stringification)
        let address = req.body.address;
        let details = req.body.details;
        let features = req.body.features;
        let amenities = req.body.amenities;

        try {
            if (typeof address === "string") address = JSON.parse(address);
            if (typeof details === "string") details = JSON.parse(details);
            if (typeof features === "string") features = JSON.parse(features);
            if (typeof amenities === "string") amenities = JSON.parse(amenities);
        } catch (parseError) {
            return res.status(400).json({ success: false, error: "Invalid data format" });
        }

        // Get metadata
        let imageMetadata = [];
        try {
            imageMetadata = req.body.imageMetadata ? JSON.parse(req.body.imageMetadata) : [];
        } catch (e) {
            console.log("Error parsing image metadata", e);
        }

        // Construct images array safely
        const images = imageFiles.map((file, index) => {
            const meta = imageMetadata[index] || {};
            // Windows path fix: replace backslashes with forward slashes
            const urlPath = `/uploads/${file.filename}`;

            return {
                url: urlPath,
                caption: meta.caption || "Property Image",
                is_primary: meta.is_primary || index === 0,
                order: index,
            };
        });

        const propertyData = {
            ...req.body,
            address,
            details,
            features,
            amenities,
            images: images,
            seller_id: req.user.userId,
        };

        const property = new Property(propertyData);
        await property.save();

        await property.populate("seller_id", "profile");

        res.status(201).json({ success: true, data: property });
    } catch (error) {
        console.error("Create property error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// 4. UPDATE PROPERTY STATUS (Admin Only)
router.patch("/:id/status", auth, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ success: false, error: "Access denied" });
        }

        const { status } = req.body;
        const property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({ success: false, error: "Property not found" });
        }

        property.status = status;
        property.approved_by = req.user.userId;
        property.approved_at = new Date();
        await property.save();

        res.json({ success: true, data: property });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
