import express from "express";
import Inquiry from "../models/Inquiry.js";
import Property from "../models/Property.js";
import User from "../models/User.js"; // Add this import
import auth from "../middleware/auth.js";

const router = express.Router();

// Create new inquiry (always goes to admin)
router.post("/", auth, async (req, res) => {
    try {
        const { property_id, message, inquiry_type, contact_preference } = req.body;

        // Get property to find original seller
        const property = await Property.findById(property_id);
        if (!property) {
            return res.status(404).json({ success: false, error: "Property not found" });
        }

        // Find an admin user to assign the inquiry to
        const adminUser = await User.findOne({ role: "admin" });
        if (!adminUser) {
            return res.status(500).json({ success: false, error: "No admin user found" });
        }

        const inquiry = new Inquiry({
            property_id,
            buyer_id: req.user.userId,
            seller_id: adminUser._id, // Always assign to admin
            original_seller_id: property.seller_id, // Store original seller for reference
            message,
            inquiry_type,
            contact_preference,
            status: "pending_admin_review", // New status
        });

        await inquiry.save();

        // Populate the inquiry with property and buyer details for response
        await inquiry.populate("property_id", "title");
        await inquiry.populate("buyer_id", "profile email");
        await inquiry.populate("original_seller_id", "profile email");

        res.status(201).json({ success: true, data: inquiry });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get inquiries for buyer (inquiries they sent)
router.get("/my-inquiries", auth, async (req, res) => {
    try {
        const inquiries = await Inquiry.find({ buyer_id: req.user.userId })
            .populate("property_id", "title address images")
            .populate("seller_id", "profile email") // This will be admin
            .populate("original_seller_id", "profile email") // Original property seller
            .sort({ created_at: -1 });

        res.json({ success: true, data: inquiries });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get inquiries for admin (all inquiries assigned to admin)
router.get("/admin-inquiries", auth, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ success: false, error: "Access denied" });
        }

        const inquiries = await Inquiry.find({ seller_id: req.user.userId })
            .populate("property_id", "title address images")
            .populate("buyer_id", "profile email")
            .populate("original_seller_id", "profile email")
            .sort({ created_at: -1 });

        res.json({ success: true, data: inquiries });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get inquiries for seller (inquiries about their properties)
router.get("/seller-inquiries", auth, async (req, res) => {
    try {
        if (req.user.role !== "seller") {
            return res.status(403).json({ success: false, error: "Access denied" });
        }

        // Get inquiries where the seller is the original seller (even if assigned to admin)
        const inquiries = await Inquiry.find({ original_seller_id: req.user.userId })
            .populate("property_id", "title address images")
            .populate("buyer_id", "profile email")
            .populate("seller_id", "profile email") // This shows which admin is handling it
            .sort({ created_at: -1 });

        res.json({ success: true, data: inquiries });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Update inquiry status (admin can forward to seller or close)
// router.patch("/:id/status", auth, async (req, res) => {
//     try {
//         const { status, note } = req.body;
//         const inquiry = await Inquiry.findById(req.params.id);

//         if (!inquiry) {
//             return res.status(404).json({ success: false, error: "Inquiry not found" });
//         }

//         // Only admin can update inquiry status
//         if (req.user.role !== "admin") {
//             return res.status(403).json({ success: false, error: "Access denied" });
//         }

//         inquiry.status = status;
//         if (note) {
//             inquiry.admin_note = note;
//         }

//         // If forwarding to seller, update the seller_id to the original seller
//         if (status === "forwarded_to_seller") {
//             inquiry.seller_id = inquiry.original_seller_id;
//         }

//         inquiry.updated_at = new Date();
//         await inquiry.save();

//         res.json({ success: true, data: inquiry });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// });

router.patch("/:id/status", auth, async (req, res) => {
    try {
        const { status, note, response_message } = req.body; // Add response_message
        const inquiry = await Inquiry.findById(req.params.id);

        if (!inquiry) {
            return res.status(404).json({ success: false, error: "Inquiry not found" });
        }

        // Only admin can update inquiry status
        if (req.user.role !== "admin") {
            return res.status(403).json({ success: false, error: "Access denied" });
        }

        inquiry.status = status;

        // Handle response message and date
        if (response_message) {
            inquiry.response_message = response_message;
            inquiry.response_date = new Date();
        }

        if (note) {
            inquiry.admin_note = note;
        }

        // If forwarding to seller, update the seller_id to the original seller
        if (status === "forwarded_to_seller") {
            inquiry.seller_id = inquiry.original_seller_id;
        }

        inquiry.updated_at = new Date();
        await inquiry.save();

        // Populate before sending response
        await inquiry.populate("property_id", "title");
        await inquiry.populate("buyer_id", "profile email");
        await inquiry.populate("seller_id", "profile email");
        await inquiry.populate("original_seller_id", "profile email");

        res.json({ success: true, data: inquiry });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// NEW ENDPOINT: Send response to buyer
router.patch("/:id/respond", auth, async (req, res) => {
    try {
        const { response_message, note } = req.body;
        const inquiry = await Inquiry.findById(req.params.id);

        if (!inquiry) {
            return res.status(404).json({ success: false, error: "Inquiry not found" });
        }

        // Only admin can respond
        if (req.user.role !== "admin") {
            return res.status(403).json({ success: false, error: "Access denied" });
        }

        if (!response_message) {
            return res.status(400).json({ success: false, error: "Response message is required" });
        }

        inquiry.response_message = response_message;
        inquiry.response_date = new Date();
        inquiry.status = "responded";

        if (note) {
            inquiry.admin_note = note;
        }

        inquiry.updated_at = new Date();
        await inquiry.save();

        // Populate before sending response
        await inquiry.populate("property_id", "title address");
        await inquiry.populate("buyer_id", "profile email");
        await inquiry.populate("seller_id", "profile email");
        await inquiry.populate("original_seller_id", "profile email");

        res.json({
            success: true,
            message: "Response sent successfully",
            data: inquiry,
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Add admin note to inquiry
router.patch("/:id/note", auth, async (req, res) => {
    try {
        const { note } = req.body;
        const inquiry = await Inquiry.findById(req.params.id);

        if (!inquiry) {
            return res.status(404).json({ success: false, error: "Inquiry not found" });
        }

        // Only admin can add notes
        if (req.user.role !== "admin") {
            return res.status(403).json({ success: false, error: "Access denied" });
        }

        inquiry.admin_note = note;
        inquiry.updated_at = new Date();
        await inquiry.save();

        res.json({ success: true, data: inquiry });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get single inquiry
router.get("/:id", auth, async (req, res) => {
    try {
        const inquiry = await Inquiry.findById(req.params.id)
            .populate("property_id", "title address")
            .populate("buyer_id", "profile email")
            .populate("seller_id", "profile email")
            .populate("original_seller_id", "profile email");

        if (!inquiry) {
            return res.status(404).json({ success: false, error: "Inquiry not found" });
        }

        // Check if user is either buyer, seller, or admin of this inquiry
        const isAuthorized =
            inquiry.buyer_id._id.toString() === req.user.userId ||
            inquiry.seller_id._id.toString() === req.user.userId ||
            inquiry.original_seller_id._id.toString() === req.user.userId ||
            req.user.role === "admin";

        if (!isAuthorized) {
            return res.status(403).json({ success: false, error: "Access denied" });
        }

        res.json({ success: true, data: inquiry });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
