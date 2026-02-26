import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";

const PropertyDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const { isPropertyFavorited, toggleFavorite } = useFavorites();

    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [showInquiryForm, setShowInquiryForm] = useState(false);
    const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
    const [inquiryData, setInquiryData] = useState({
        message: "",
        inquiry_type: "information",
        contact_preference: "email",
    });

    // Helper to resolve image URLs
    const getImageUrl = (url) => {
        if (!url) return null;
        if (url.startsWith("http")) return url;
        return `http://localhost:5000${url}`;
    };

    useEffect(() => {
        loadProperty();
    }, [id]);

    const loadProperty = async () => {
        try {
            setLoading(true);
            const response = await api.getPropertyById(id);
            if (response.success) {
                setProperty(response.data);
            } else {
                setError("Property not found");
            }
        } catch (err) {
            setError("Failed to load property details");
        } finally {
            setLoading(false);
        }
    };

    const formatText = (text) => {
        return text.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    };

    const formatDate = (date) => {
        if (!date) return "N/A";
        const dateObj = date.$date ? new Date(date.$date) : new Date(date);
        return dateObj.toLocaleDateString();
    };

    const handleInquirySubmit = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }

        if (!property) {
            alert("Property information not available");
            return;
        }

        try {
            const inquiryPayload = {
                property_id: property._id?.$oid || property._id,
                message: inquiryData.message,
                inquiry_type: inquiryData.inquiry_type,
                contact_preference: inquiryData.contact_preference,
            };

            const response = await api.createInquiry(inquiryPayload);

            if (response.success) {
                alert("Inquiry sent to admin successfully! Our team will review your request and contact you soon.");
                setShowInquiryForm(false);
                setInquiryData({
                    message: "",
                    inquiry_type: "information",
                    contact_preference: "email",
                });
            } else {
                alert("Failed to send inquiry. Please try again.");
            }
        } catch (error) {
            alert("Failed to send inquiry. Please try again.");
            console.error("Inquiry submission error:", error);
        }
    };

    const handleContactAgent = () => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }
        setShowInquiryForm(true);
    };

    const handleFavoriteClick = async () => {
        if (!property) return;

        if (!isAuthenticated || user?.role !== "buyer") {
            alert("Please login as a buyer to add favorites");
            return;
        }

        setIsFavoriteLoading(true);
        const propertyId = property._id?.$oid || property._id;
        await toggleFavorite(propertyId);
        setIsFavoriteLoading(false);
    };

    const isFavorited = property ? isPropertyFavorited(property._id?.$oid || property._id) : false;

    if (loading) {
        return (
            <div className="container mt-4">
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger">
                    {error}
                    <div className="mt-2">
                        <Link to="/" className="btn btn-primary">
                            Back to Properties
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!property) {
        return (
            <div className="container mt-4">
                <div className="alert alert-warning">
                    Property not found.
                    <div className="mt-2">
                        <Link to="/" className="btn btn-primary">
                            Back to Properties
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Default mock image if none exists
    const displayImages = property.images && property.images.length > 0 ? property.images : [{ url: null, caption: "No Image Available" }];

    return (
        <div className="container mt-4">
            {/* Breadcrumb */}
            <div className="dashboard-header">
                <div className="container">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <Link to="/" className="text-white">
                                    Properties
                                </Link>
                            </li>
                            <li className="breadcrumb-item active text-white">{property.title}</li>
                        </ol>
                    </nav>
                    <h1 className="text-white">{property.title}</h1>
                    <p className="text-white mb-0">
                        📍 {property.address?.street}, {property.address?.city}, {property.address?.state}
                    </p>
                </div>
            </div>

            <div className="row">
                {/* Property Images */}
                <div className="col-lg-8">
                    <div className="card mb-4">
                        <div className="procard p-0">
                            <div className="property-image-main">
                                {displayImages[activeImageIndex]?.url ? (
                                    <img
                                        src={getImageUrl(displayImages[activeImageIndex].url)}
                                        alt={displayImages[activeImageIndex].caption || property.title}
                                        className="w-100"
                                        style={{ height: "400px", objectFit: "cover" }}
                                        onError={(e) => {
                                            e.target.src = "https://placehold.co/600x400?text=No+Image";
                                        }}
                                    />
                                ) : (
                                    <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: "400px" }}>
                                        <div className="text-center text-muted">
                                            <div style={{ fontSize: "3rem" }}>🏠</div>
                                            <p>No Images Available</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Image Thumbnails */}
                            {displayImages.length > 1 && (
                                <div className="property-thumbnails p-3">
                                    <div className="row g-2">
                                        {displayImages.map((image, index) => (
                                            <div key={index} className="col-3">
                                                <div
                                                    className={`thumbnail ${activeImageIndex === index ? "active" : ""}`}
                                                    style={{
                                                        height: "80px",
                                                        cursor: "pointer",
                                                        border: activeImageIndex === index ? "3px solid #007bff" : "1px solid #dee2e6",
                                                    }}
                                                    onClick={() => setActiveImageIndex(index)}
                                                >
                                                    <img
                                                        src={getImageUrl(image.url)}
                                                        alt={image.caption}
                                                        className="w-100 h-100 object-fit-cover"
                                                        onError={(e) => {
                                                            e.target.style.display = "none";
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Property Details */}
                    <div className="card mb-4">
                        <div className="card-header">
                            <h4 className="mb-0">Property Details</h4>
                        </div>
                        <div className="procard">
                            <h2 className="card-title">{property.title}</h2>
                            <p className="text-muted mb-3">
                                📍 {property.address?.street}, {property.address?.city}, {property.address?.state} {property.address?.zip_code}
                            </p>

                            <div className="row mb-4">
                                <div className="col-md-3">
                                    <div className="text-center p-3 border rounded">
                                        <strong className="d-block h5 text-primary">{property.details?.bedrooms || 0}</strong>
                                        <small className="text-muted">Bedrooms</small>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="text-center p-3 border rounded">
                                        <strong className="d-block h5 text-primary">{property.details?.bathrooms || 0}</strong>
                                        <small className="text-muted">Bathrooms</small>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="text-center p-3 border rounded">
                                        <strong className="d-block h5 text-primary">{property.details?.area_sqft || 0}</strong>
                                        <small className="text-muted">Sq Ft</small>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="text-center p-3 border rounded">
                                        <strong className="d-block h5 text-primary">{property.details?.year_built || "N/A"}</strong>
                                        <small className="text-muted">Year Built</small>
                                    </div>
                                </div>
                            </div>

                            <h5>Description</h5>
                            <p className="mb-4">{property.description}</p>

                            {/* Features & Amenities */}
                            <div className="row">
                                {property.features && property.features.length > 0 && (
                                    <div className="col-md-6">
                                        <h5>🏠 Property Features</h5>
                                        <div className="row">
                                            {property.features.map((feature, index) => (
                                                <div key={index} className="col-6 mb-2">
                                                    <div className="d-flex align-items-center">
                                                        <span className="text-success me-2">✓</span>
                                                        <span>{formatText(feature)}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {property.amenities && property.amenities.length > 0 && (
                                    <div className="col-md-6">
                                        <h5>⭐ Amenities</h5>
                                        <div className="row">
                                            {property.amenities.map((amenity, index) => (
                                                <div key={index} className="col-6 mb-2">
                                                    <div className="d-flex align-items-center">
                                                        <span className="text-success me-2">✓</span>
                                                        <span>{formatText(amenity)}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar - Price & Contact */}
                <div className="col-lg-4">
                    <div className="card sticky-top" style={{ top: "20px" }}>
                        <div className="card-body">
                            <div className="text-center mb-4">
                                <h3 className="text-primary">
                                    ${property.price?.toLocaleString()}
                                    {property.transaction_type === "rent" && <small>/month</small>}
                                </h3>
                                <span className={`badge ${property.status === "approved" ? "bg-success" : property.status === "pending" ? "bg-warning" : "bg-danger"}`}>{property.status}</span>
                            </div>

                            <div className="d-grid gap-2 mb-3">
                                <button className="btn btn-primary btn-lg" onClick={handleContactAgent}>
                                    {isAuthenticated ? "Contact Admin" : "Login to Contact Admin"}
                                </button>

                                {isAuthenticated && user?.role === "buyer" && (
                                    <button className={`btn ${isFavorited ? "btn-danger" : "btn-outline-danger"}`} onClick={handleFavoriteClick} disabled={isFavoriteLoading}>
                                        {isFavoriteLoading ? (
                                            <>
                                                <div className="spinner-border spinner-border-sm me-2" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                                Loading...
                                            </>
                                        ) : isFavorited ? (
                                            "❤️ Remove from Favorites"
                                        ) : (
                                            "🤍 Add to Favorites"
                                        )}
                                    </button>
                                )}
                            </div>

                            {/* Quick Stats */}
                            <div className="border-top pt-3">
                                <h6>Property Facts</h6>
                                <table className="table table-sm">
                                    <tbody>
                                        <tr>
                                            <td>Type:</td>
                                            <td>
                                                <span className="text-capitalize">{property.property_type}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Transaction:</td>
                                            <td>
                                                <span className="text-capitalize">{property.transaction_type}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Status:</td>
                                            <td>
                                                <span className="text-capitalize">{property.status}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Listed:</td>
                                            <td>{formatDate(property.created_at)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Inquiry Modal */}
            {showInquiryForm && (
                <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Contact Admin</h5>
                                <button type="button" className="btn-close" onClick={() => setShowInquiryForm(false)}></button>
                            </div>
                            <form onSubmit={handleInquirySubmit}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Inquiry Type</label>
                                        <select
                                            className="form-control"
                                            value={inquiryData.inquiry_type}
                                            onChange={(e) =>
                                                setInquiryData((prev) => ({
                                                    ...prev,
                                                    inquiry_type: e.target.value,
                                                }))
                                            }
                                            required
                                        >
                                            <option value="information">General Information</option>
                                            <option value="viewing">Schedule Viewing</option>
                                            <option value="offer">Make an Offer</option>
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Contact Preference</label>
                                        <select
                                            className="form-control"
                                            value={inquiryData.contact_preference}
                                            onChange={(e) =>
                                                setInquiryData((prev) => ({
                                                    ...prev,
                                                    contact_preference: e.target.value,
                                                }))
                                            }
                                            required
                                        >
                                            <option value="email">Email</option>
                                            <option value="phone">Phone</option>
                                            <option value="both">Both</option>
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Message</label>
                                        <textarea
                                            className="form-control"
                                            rows="4"
                                            placeholder="Tell the agent what you're interested in..."
                                            value={inquiryData.message}
                                            onChange={(e) =>
                                                setInquiryData((prev) => ({
                                                    ...prev,
                                                    message: e.target.value,
                                                }))
                                            }
                                            required
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowInquiryForm(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Send Inquiry
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PropertyDetails;
