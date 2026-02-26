import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useFavorites } from "../../context/FavoritesContext";

const PropertyCard = ({ property }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [imageError, setImageError] = useState(false);
    const { isAuthenticated, user } = useAuth();
    const { isPropertyFavorited, toggleFavorite } = useFavorites();

    // Helper to resolve image URLs
    const getImageUrl = (url) => {
        if (!url) return null;
        // If it's an external link (http/https), return as is
        if (url.startsWith("http")) return url;
        // If it's a local upload, prepend the backend URL
        // Adjust port 5000 if your server runs elsewhere
        return `http://localhost:5000${url}`;
    };

    const formatText = (text) => {
        return text.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    };

    const handleFavoriteClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated || user.role !== "buyer") {
            alert("Please login as a buyer to add favorites");
            return;
        }

        setIsLoading(true);
        const propertyId = property._id?.$oid || property._id;
        await toggleFavorite(propertyId);
        setIsLoading(false);
    };

    const isFavorited = isPropertyFavorited(property._id?.$oid || property._id);

    // Get the primary image or first image
    const getPropertyImage = () => {
        if (property.images && property.images.length > 0) {
            const primaryImage = property.images.find((img) => img.is_primary);
            return primaryImage || property.images[0];
        }
        return null;
    };

    const propertyImage = getPropertyImage();

    return (
        <div className="card h-100 property-card">
            <div className="card-img-top position-relative bg-light" style={{ height: "200px" }}>
                {propertyImage ? (
                    <img
                        src={getImageUrl(propertyImage.url)}
                        alt={propertyImage.caption || property.title}
                        className="w-100 h-100 object-fit-cover"
                        onError={(e) => {
                            // Fallback if image fails to load
                            e.target.style.display = "none";
                            setImageError(true);
                        }}
                    />
                ) : (
                    <div className="d-flex align-items-center justify-content-center h-100 text-muted">🏠 Property Image</div>
                )}

                {imageError && <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-light text-muted">🏠 Image Unavailable</div>}

                {/* Favorite Button */}
                {isAuthenticated && user.role === "buyer" && (
                    <button
                        className={`btn btn-sm position-absolute top-0 end-0 m-2`}
                        onClick={handleFavoriteClick}
                        disabled={isLoading}
                        style={{
                            border: "none",
                            width: "40px",
                            height: "40px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 2,
                        }}
                    >
                        {isLoading ? (
                            <div className="spinner-border spinner-border-sm" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        ) : isFavorited ? (
                            "❤️"
                        ) : (
                            "🤍"
                        )}
                    </button>
                )}

                {/* Image Count Badge */}
                {property.images && property.images.length > 1 && (
                    <div className="position-absolute top-0 start-0 m-4">
                        <span className="badge bg-dark bg-opacity-75">📷 {property.images.length}</span>
                    </div>
                )}
            </div>
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title">{property.title}</h5>
                    <span className="badge bg-primary text-capitalize">{property.property_type}</span>
                </div>
                <p className="card-text text-muted small">{property.description?.substring(0, 100)}...</p>

                {/* Features Preview */}
                {property.features && property.features.length > 0 && (
                    <div className="mb-2">
                        <div className="d-flex flex-wrap gap-1">
                            {property.features.slice(0, 3).map((feature, index) => (
                                <span key={index} className="badge bg-light text-dark small">
                                    {formatText(feature)}
                                </span>
                            ))}
                            {property.features.length > 3 && <span className="badge bg-light text-dark small">+{property.features.length - 3} more</span>}
                        </div>
                    </div>
                )}

                <div className="property-details mb-2">
                    <small className="text-muted">
                        📍 {property.address?.city}, {property.address?.state}
                    </small>
                    <br />
                    <small className="text-muted">
                        🛏️ {property.details?.bedrooms || 0} bed • 🛁 {property.details?.bathrooms || 0} bath • 📏 {property.details?.area_sqft || 0} sq ft
                    </small>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                    <strong className="text-primary">
                        ${property.price?.toLocaleString()}
                        {property.transaction_type === "rent" && "/month"}
                    </strong>
                    <Link to={`/property/${property._id?.$oid || property._id}`} className="btn btn-sm btn-outline-primary">
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PropertyCard;
