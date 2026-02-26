import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";
import PropertyCard from "../components/Property/PropertyCard";
import api from "../services/api";

const BuyerDashboard = () => {
    const { user } = useAuth();
    const { favorites, loading: favoritesLoading } = useFavorites();
    const [inquiries, setInquiries] = useState([]);
    const [inquiriesLoading, setInquiriesLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("favorites");

    // --- HELPER: Resolve Image URL ---
    const getImageUrl = (url) => {
        if (!url) return null;
        // Assuming backend runs on port 5000
        if (url.startsWith("http")) return url; // External link
        return `http://localhost:5000${url}`; // Local server image
    };

    useEffect(() => {
        if (user?.role === "buyer") {
            loadInquiries();
        }
    }, [user]);

    const loadInquiries = async () => {
        setInquiriesLoading(true);
        try {
            const response = await api.getMyInquiries();
            if (response.success) {
                setInquiries(response.data);
            }
        } catch (error) {
            console.error("Error loading inquiries:", error);
        } finally {
            setInquiriesLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending_admin_review: { class: "bg-warning", text: "Under Review" },
            admin_handling: { class: "bg-info", text: "Admin Handling" },
            forwarded_to_seller: { class: "bg-primary", text: "Forwarded to Seller" },
            responded: { class: "bg-success", text: "Responded" },
            closed: { class: "bg-secondary", text: "Closed" },
            rejected: { class: "bg-danger", text: "Rejected" },
        };
        const config = statusConfig[status] || statusConfig.pending_admin_review;
        return <span className={`badge ${config.class}`}>{config.text}</span>;
    };

    const formatDate = (date) => {
        if (!date) return "N/A";
        const dateObj = date.$date ? new Date(date.$date) : new Date(date);
        return dateObj.toLocaleDateString();
    };

    // --- REVISED RESPONSE LOGIC ---
    const renderResponseContent = (inquiry) => {
        // Check all common potential fields for the response message.
        // Ensure we trim whitespace and check for non-empty string content.
        const messageCandidates = [
            inquiry.response_message, // Standard field for the reply
            inquiry.response, // Potential alternative field
            inquiry.admin_note, // Admin might put the reply here
            inquiry.note, // Another potential legacy field
        ];

        // Find the first non-null, non-undefined, non-empty, non-whitespace-only string
        const responseMessage = messageCandidates.find((msg) => msg && typeof msg === "string" && msg.trim().length > 0);

        // Look for the response date
        const responseDate = inquiry.response_date || inquiry.updated_at;

        // 1. Handle "responded" status
        if (inquiry.status === "responded") {
            if (responseMessage) {
                // Case: Response text IS available (The preferred display, like the last entry)
                return (
                    <div className="response-content">
                        <div className="d-flex justify-content-between align-items-start mb-1">
                            <strong className="text-success">📩 ADMIN RESPONSE:</strong>
                            {responseDate && <small className="text-muted-2 ms-2">{formatDate(responseDate)}</small>}
                        </div>
                        <p className="mb-0 text-dark small bg-light p-2 rounded border-start border-4 border-success">{responseMessage}</p>
                    </div>
                );
            } else {
                // Case: Status is responded, but NO response text is available (The generic fallback)
                return (
                    <div className="text-success small">
                        <strong>✅ Request Completed</strong>
                        <br />
                        <em className="text-muted-2">Status updated on {formatDate(responseDate)}</em>
                    </div>
                );
            }
        }

        // 2. Status-specific messages for non-responded statuses (Switch remains the same)
        switch (inquiry.status) {
            case "admin_handling":
                return (
                    <div className="text-info small">
                        <strong>👤 Admin Handling</strong>
                        <br />
                        <em>Our team is actively reviewing your inquiry.</em>
                    </div>
                );
            case "forwarded_to_seller":
                return (
                    <div className="text-primary small">
                        <strong>📨 Forwarded to Seller</strong>
                        <br />
                        <em>The seller has been notified and will contact you directly.</em>
                    </div>
                );
            case "pending_admin_review":
                return (
                    <div className="text-warning small">
                        <strong>⏳ Under Review</strong>
                        <br />
                        <em>Waiting for admin approval.</em>
                    </div>
                );
            case "closed":
                return (
                    <div className="text-secondary small">
                        <strong>🔒 Inquiry Closed</strong>
                    </div>
                );
            case "rejected":
                // Use the responseMessage here too if available
                return (
                    <div className="text-danger small">
                        <strong>❌ Request Rejected</strong>
                        {responseMessage && <div className="mt-1">Reason: {responseMessage}</div>}
                    </div>
                );
            default:
                return <span className="text-muted-2 small">No updates yet</span>;
        }
    };

    return (
        <>
            <div className="dashboard-header">
                <div className="container">
                    <h1>Buyer Dashboard</h1>
                    <p>Find your dream home</p>
                </div>
            </div>
            <div className="container mt-4">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-body2">
                                <div className="text-center py-3">
                                    <h3>Welcome, {user?.profile?.first_name}! 👋</h3>
                                    <p className="text-muted-21 mb-4">Start browsing properties and find your dream home.</p>

                                    {/* Tabs Content */}
                                    <div className="mt-5">
                                        <ul className="nav nav-tabs">
                                            <li className="nav-item">
                                                <button className={`nav-link ${activeTab === "favorites" ? "active" : ""}`} onClick={() => setActiveTab("favorites")}>
                                                    ❤️ My Favorites ({favorites.length})
                                                </button>
                                            </li>
                                            <li className="nav-item">
                                                <button className={`nav-link ${activeTab === "inquiries" ? "active" : ""}`} onClick={() => setActiveTab("inquiries")}>
                                                    📞 My Inquiries ({inquiries.length})
                                                </button>
                                            </li>
                                        </ul>

                                        <div className="tab-content mt-4">
                                            {/* Favorites Tab */}
                                            {activeTab === "favorites" && (
                                                <div>
                                                    {favoritesLoading ? (
                                                        <div className="text-center py-4">
                                                            <div className="spinner-border" role="status">
                                                                <span className="visually-hidden">Loading...</span>
                                                            </div>
                                                            <p className="mt-2">Loading your favorites...</p>
                                                        </div>
                                                    ) : favorites.length === 0 ? (
                                                        <div className="text-center py-5">
                                                            <div className="display-1 text-muted-2 mb-3">🤍</div>
                                                            <h5>No favorites yet</h5>
                                                            <p className="text-muted">Start browsing properties and add them to your favorites!</p>
                                                            <Link to="/" className="btn btn-primary">
                                                                Browse Properties
                                                            </Link>
                                                        </div>
                                                    ) : (
                                                        <div className="row">
                                                            {favorites.map((property) => (
                                                                <div key={property._id?.$oid || property._id} className="col-lg-4 col-md-6 mb-4">
                                                                    <PropertyCard property={property} />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Inquiries Tab */}
                                            {activeTab === "inquiries" && (
                                                <div>
                                                    {inquiriesLoading ? (
                                                        <div className="text-center py-4">
                                                            <div className="spinner-border" role="status">
                                                                <span className="visually-hidden">Loading...</span>
                                                            </div>
                                                            <p className="mt-2">Loading your inquiries...</p>
                                                        </div>
                                                    ) : inquiries.length === 0 ? (
                                                        <div className="text-center py-5">
                                                            <div className="display-1 text-muted-2 mb-3">📝</div>
                                                            <h5>No inquiries yet</h5>
                                                            <p className="text-muted-2">Contact sellers about properties you're interested in!</p>
                                                            <Link to="/" className="btn btn-primary">
                                                                Browse Properties
                                                            </Link>
                                                        </div>
                                                    ) : (
                                                        <div className="table-responsive">
                                                            <table className="table table-striped table-hover align-middle">
                                                                <thead className="table-light">
                                                                    <tr>
                                                                        <th style={{ width: "25%" }}>Property</th>
                                                                        <th style={{ width: "20%" }}>Your Message</th>
                                                                        <th>Type</th>
                                                                        <th>Status</th>
                                                                        <th style={{ width: "30%" }}>Response</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {inquiries.map((inquiry) => (
                                                                        <tr key={inquiry._id?.$oid || inquiry._id}>
                                                                            <td>
                                                                                <div className="d-flex align-items-center">
                                                                                    {/* --- FIX: USE getImageUrl HERE --- */}
                                                                                    {inquiry.property_id && inquiry.property_id.images && inquiry.property_id.images.length > 0 ? (
                                                                                        <img
                                                                                            src={getImageUrl(
                                                                                                inquiry.property_id.images.find((img) => img.is_primary)?.url || inquiry.property_id.images[0].url
                                                                                            )}
                                                                                            alt={inquiry.property_id.title}
                                                                                            className="rounded me-3"
                                                                                            style={{ width: "60px", height: "60px", objectFit: "cover" }}
                                                                                            onError={(e) => {
                                                                                                e.target.src = "https://placehold.co/60x60?text=No+Img";
                                                                                            }}
                                                                                        />
                                                                                    ) : (
                                                                                        <div
                                                                                            className="rounded me-3 d-flex align-items-center justify-content-center bg-light border"
                                                                                            style={{ width: "60px", height: "60px" }}
                                                                                        >
                                                                                            🏠
                                                                                        </div>
                                                                                    )}
                                                                                    <div>
                                                                                        <strong>
                                                                                            <Link
                                                                                                to={`/property/${inquiry.property_id._id?.$oid || inquiry.property_id._id}`}
                                                                                                className="text-decoration-none text-dark"
                                                                                            >
                                                                                                {inquiry.property_id.title}
                                                                                            </Link>
                                                                                        </strong>
                                                                                        <br />
                                                                                        <small className="text-muted-2-2">
                                                                                            {inquiry.property_id.address?.city}, {inquiry.property_id.address?.state}
                                                                                        </small>
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                            <td>
                                                                                <div className="message-preview">
                                                                                    <p className="mb-1 small text-truncate" style={{ maxWidth: "200px" }} title={inquiry.message}>
                                                                                        {inquiry.message}
                                                                                    </p>
                                                                                    <small className="text-muted-2">
                                                                                        Contact via: <span className="text-capitalize">{inquiry.contact_preference}</span>
                                                                                    </small>
                                                                                </div>
                                                                            </td>
                                                                            <td>
                                                                                <span className="badge bg-light text-dark text-capitalize border">{inquiry.inquiry_type}</span>
                                                                            </td>
                                                                            <td>{getStatusBadge(inquiry.status)}</td>
                                                                            <td>{renderResponseContent(inquiry)}</td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BuyerDashboard;
