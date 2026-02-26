import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const AdminDashboard = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("pending");
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const { user } = useAuth();

    // --- HELPER: Resolve Image URL ---
    const getImageUrl = (url) => {
        if (!url) return null;
        if (url.startsWith("http")) return url; // External link
        return `http://localhost:5000${url}`; // Local server image
    };

    useEffect(() => {
        loadProperties();
    }, [activeTab]);

    const loadProperties = async () => {
        setLoading(true);
        try {
            const response = await api.getProperties({
                status: activeTab === "all" ? undefined : activeTab,
            });

            if (response.success) {
                setProperties(response.data);
            }
        } catch (error) {
            console.error("Error loading properties:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (propertyId) => {
        try {
            const response = await api.updatePropertyStatus(propertyId, "approved");
            if (response.success) {
                loadProperties(); // Reload the list
            }
        } catch (error) {
            console.error("Error approving property:", error);
        }
    };

    const handleReject = async (propertyId) => {
        try {
            const response = await api.updatePropertyStatus(propertyId, "rejected");
            if (response.success) {
                loadProperties(); // Reload the list
            }
        } catch (error) {
            console.error("Error rejecting property:", error);
        }
    };

    // Quick preview function
    const showQuickPreview = (property) => {
        setSelectedProperty(property);
        setShowPreview(true);
    };

    // Helper function to get property ID
    const getPropertyId = (property) => {
        return property._id?.$oid || property._id;
    };

    // Helper function to format price with transaction type
    const formatPrice = (property) => {
        const price = property.price?.toLocaleString();
        return `$${price}${property.transaction_type === "rent" ? "/month" : ""}`;
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: "warning",
            approved: "success",
            rejected: "danger",
        };
        return `badge bg-${statusConfig[status]}`;
    };

    // Format text helper
    const formatText = (text) => {
        return text?.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) || "";
    };

    // Format date helper
    const formatDate = (date) => {
        if (!date) return "N/A";
        const dateObj = date.$date ? new Date(date.$date) : new Date(date);
        return dateObj.toLocaleDateString();
    };

    return (
        <>
            <div className="dashboard-header">
                <div className="container">
                    <h1>Admin Dashboard</h1>
                    <p>Manage property approvals and platform content</p>
                </div>
            </div>
            <div className="card-body">
                <div className="container mt-4">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="card-body">
                                    {/* Statistics Cards - Add these if you want consistent stats like in AdminInquiries */}
                                    <div className="row mb-4">
                                        <div className="col-md-3">
                                            <div className="card text-center">
                                                <div className="card-body">
                                                    <h3>{properties.filter((p) => p.status === "pending").length}</h3>
                                                    <p className="text-muted">Pending</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="card text-center">
                                                <div className="card-body">
                                                    <h3 className="text-success">{properties.filter((p) => p.status === "approved").length}</h3>
                                                    <p className="text-muted">Approved</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="card text-center">
                                                <div className="card-body">
                                                    <h3 className="text-danger">{properties.filter((p) => p.status === "rejected").length}</h3>
                                                    <p className="text-muted">Rejected</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="card text-center">
                                                <div className="card-body">
                                                    <h3 className="text-primary">{properties.length}</h3>
                                                    <p className="text-muted">Total</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tabs and Table */}
                                    <ul className="nav nav-tabs">
                                        <ul className="nav nav-tabs">
                                            <li className="nav-item">
                                                <button className={`nav-link ${activeTab === "pending" ? "active" : ""}`} onClick={() => setActiveTab("pending")}>
                                                    Pending Approval
                                                </button>
                                            </li>
                                            <li className="nav-item">
                                                <button className={`nav-link ${activeTab === "approved" ? "active" : ""}`} onClick={() => setActiveTab("approved")}>
                                                    Approved
                                                </button>
                                            </li>
                                            <li className="nav-item">
                                                <button className={`nav-link ${activeTab === "rejected" ? "active" : ""}`} onClick={() => setActiveTab("rejected")}>
                                                    Rejected
                                                </button>
                                            </li>
                                            <li className="nav-item">
                                                <button className={`nav-link ${activeTab === "all" ? "active" : ""}`} onClick={() => setActiveTab("all")}>
                                                    All Properties
                                                </button>
                                            </li>
                                        </ul>

                                        <div className="tab-content mt-3 w-100">
                                            {loading ? (
                                                <div className="text-center py-4">
                                                    <div className="spinner-border" role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>
                                                    <p className="mt-2">Loading properties...</p>
                                                </div>
                                            ) : (
                                                <div className="table-responsive">
                                                    <table className="table table-striped table-hover">
                                                        <thead className="table-dark">
                                                            <tr>
                                                                <th>Property</th>
                                                                <th>Type</th>
                                                                <th>Price</th>
                                                                <th>Location</th>
                                                                <th>Seller</th>
                                                                <th>Status</th>
                                                                <th>Date Added</th>
                                                                <th>Actions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {properties.map((property) => (
                                                                <tr key={getPropertyId(property)}>
                                                                    <td>
                                                                        <div className="d-flex align-items-center">
                                                                            {/* Property Image Thumbnail */}
                                                                            {property.images && property.images.length > 0 ? (
                                                                                <img
                                                                                    src={getImageUrl(property.images.find((img) => img.is_primary)?.url || property.images[0].url)}
                                                                                    alt={property.title}
                                                                                    className="rounded me-3"
                                                                                    style={{ width: "60px", height: "60px", objectFit: "cover" }}
                                                                                    onError={(e) => {
                                                                                        e.target.src = "https://placehold.co/60x60?text=No+Img";
                                                                                    }}
                                                                                />
                                                                            ) : (
                                                                                <div
                                                                                    className="rounded me-3 d-flex align-items-center justify-content-center bg-light"
                                                                                    style={{ width: "60px", height: "60px" }}
                                                                                >
                                                                                    🏠
                                                                                </div>
                                                                            )}
                                                                            <div>
                                                                                <strong>{property.title}</strong>
                                                                                <br />
                                                                                <small className="text-muted-2">
                                                                                    {property.details?.bedrooms || 0} bed, {property.details?.bathrooms || 0} bath, {property.details?.area_sqft || 0}{" "}
                                                                                    sq ft
                                                                                </small>
                                                                                <br />
                                                                                <small className="text-muted-2">{property.images?.length || 0} image(s)</small>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <span className="text-capitalize">{property.property_type}</span>
                                                                        <br />
                                                                        <small className="text-muted-2 text-capitalize">{property.transaction_type}</small>
                                                                    </td>
                                                                    <td>
                                                                        <strong className="text-primary" style={{ color: "rgba(255, 255, 255, 0.1)" }}>
                                                                            {formatPrice(property)}
                                                                        </strong>
                                                                    </td>
                                                                    <td>
                                                                        {property.address?.city}, {property.address?.state}
                                                                        <br />
                                                                        <small className="text-muted-2">{property.address?.zip_code}</small>
                                                                    </td>
                                                                    <td>
                                                                        <div>
                                                                            {property.seller_id?.profile?.first_name} {property.seller_id?.profile?.last_name}
                                                                            <br />
                                                                            <small className="text-muted" style={{ color: "rgba(255, 255, 255, 0.1)" }}>
                                                                                {property.seller_id?.email}
                                                                            </small>
                                                                            {/* <small className="text-muted" style={{ color: "rgba(255, 255, 255, 0.1)" }}>
                                                                            </small> */}
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <span className={getStatusBadge(property.status)}>{property.status}</span>
                                                                    </td>
                                                                    <td>{formatDate(property.created_at)}</td>
                                                                    <td>
                                                                        <div className="btn-group-vertical btn-group-sm">
                                                                            {/* Quick Preview Button */}
                                                                            <button
                                                                                className="btn btn-outline-info btn-sm mb-1"
                                                                                onClick={() => showQuickPreview(property)}
                                                                                title="Quick preview of property details"
                                                                            >
                                                                                👁️ Quick Preview
                                                                            </button>

                                                                            {/* Approve/Reject Buttons - Only for pending properties */}
                                                                            {property.status === "pending" && (
                                                                                <>
                                                                                    <button
                                                                                        className="btn btn-success btn-sm mb-1"
                                                                                        onClick={() => handleApprove(getPropertyId(property))}
                                                                                        title="Approve this property listing"
                                                                                    >
                                                                                        ✅ Approve
                                                                                    </button>
                                                                                    <button
                                                                                        className="btn btn-danger btn-sm"
                                                                                        onClick={() => handleReject(getPropertyId(property))}
                                                                                        title="Reject this property listing"
                                                                                    >
                                                                                        ❌ Reject
                                                                                    </button>
                                                                                </>
                                                                            )}
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>

                                                    {properties.length === 0 && (
                                                        <div className="text-center py-5">
                                                            <div className="display-1 text-muted mb-3">
                                                                {activeTab === "pending" ? "📋" : activeTab === "approved" ? "✅" : activeTab === "rejected" ? "❌" : "🏠"}
                                                            </div>
                                                            <h5>No properties found</h5>
                                                            <p className="text-muted">
                                                                {activeTab === "pending"
                                                                    ? "No properties are pending approval."
                                                                    : activeTab === "approved"
                                                                    ? "No properties have been approved yet."
                                                                    : activeTab === "rejected"
                                                                    ? "No properties have been rejected."
                                                                    : "No properties found in the system."}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </ul>

                                    <div className="tab-content mt-3">
                                        {loading ? (
                                            <div className="text-center py-4">
                                                <div className="spinner-border" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                                <p className="mt-2">Loading properties...</p>
                                            </div>
                                        ) : (
                                            <div className="table-responsive">
                                                <table className="table table-striped table-hover">{/* ... your existing table content ... */}</table>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Preview Modal */}
            {showPreview && selectedProperty && (
                <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title">Property Preview: {selectedProperty.title}</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowPreview(false)}></button>
                            </div>
                            <div className="modal-body" style={{ maxHeight: "70vh", overflowY: "auto" }}>
                                <div className="row">
                                    <div className="col-md-6">
                                        {/* Main Image */}
                                        {selectedProperty.images && selectedProperty.images.length > 0 ? (
                                            <img
                                                src={getImageUrl(selectedProperty.images.find((img) => img.is_primary)?.url || selectedProperty.images[0].url)}
                                                alt={selectedProperty.title}
                                                className="img-fluid rounded mb-3"
                                                style={{ maxHeight: "300px", objectFit: "cover", width: "100%" }}
                                                onError={(e) => {
                                                    e.target.src = "https://placehold.co/400x300?text=No+Image";
                                                }}
                                            />
                                        ) : (
                                            <div className="bg-light d-flex align-items-center justify-content-center rounded mb-3" style={{ height: "200px" }}>
                                                <div className="text-center text-muted">
                                                    <div style={{ fontSize: "3rem" }}>🏠</div>
                                                    <p>No Image Available</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Additional Images */}
                                        {selectedProperty.images && selectedProperty.images.length > 1 && (
                                            <div className="mb-3">
                                                <h6>Additional Images ({selectedProperty.images.length - 1})</h6>
                                                <div className="d-flex flex-wrap gap-2">
                                                    {selectedProperty.images.slice(1, 5).map((image, index) => (
                                                        <img
                                                            key={index}
                                                            src={getImageUrl(image.url)}
                                                            alt={image.caption}
                                                            className="rounded"
                                                            style={{ width: "80px", height: "80px", objectFit: "cover", cursor: "pointer" }}
                                                            onClick={() => {
                                                                // Set this image as the main preview (local state logic)
                                                                const updatedImages = [...selectedProperty.images];
                                                                [updatedImages[0], updatedImages[index + 1]] = [updatedImages[index + 1], updatedImages[0]];
                                                                setSelectedProperty({
                                                                    ...selectedProperty,
                                                                    images: updatedImages,
                                                                });
                                                            }}
                                                        />
                                                    ))}
                                                    {selectedProperty.images.length > 5 && (
                                                        <div className="rounded bg-light d-flex align-items-center justify-content-center" style={{ width: "80px", height: "80px" }}>
                                                            +{selectedProperty.images.length - 5}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Price and Basic Info */}
                                        <div className="card">
                                            <div className="card-body">
                                                <h4 className="text-primary mb-3">{formatPrice(selectedProperty)}</h4>
                                                <div className="row">
                                                    <div className="col-6">
                                                        <p>
                                                            <strong style={{ color: "#211e1e" }}>Type:</strong>
                                                        </p>
                                                        <p>
                                                            <strong style={{ color: "#211e1e" }}>Transaction:</strong>
                                                        </p>
                                                        <p>
                                                            <strong style={{ color: "#211e1e" }}>Status:</strong>
                                                        </p>
                                                        <p>
                                                            <strong style={{ color: "#211e1e" }}>Listed:</strong>
                                                        </p>
                                                    </div>
                                                    <div className="col-6">
                                                        <p className="text-capitalize" style={{ color: "#211e1e" }}>
                                                            {selectedProperty.property_type}
                                                        </p>
                                                        <p className="text-capitalize" style={{ color: "#211e1e" }}>
                                                            {selectedProperty.transaction_type}
                                                        </p>
                                                        <p>
                                                            <span className={getStatusBadge(selectedProperty.status)}>{selectedProperty.status}</span>
                                                        </p>
                                                        <p style={{ color: "#211e1e" }}>{formatDate(selectedProperty.created_at)}</p>
                                                    </div>
                                                </div>
                                                <hr />
                                                <div className="row">
                                                    <div className="col-6">
                                                        <p>
                                                            <strong style={{ color: "#211e1e" }}>Bedrooms:</strong>
                                                        </p>
                                                        <p>
                                                            <strong style={{ color: "#211e1e" }}>Bathrooms:</strong>
                                                        </p>
                                                        <p>
                                                            <strong style={{ color: "#211e1e" }}>Area:</strong>
                                                        </p>
                                                        <p>
                                                            <strong style={{ color: "#211e1e" }}>Year Built:</strong>
                                                        </p>
                                                    </div>
                                                    <div className="col-6">
                                                        <p style={{ color: "#211e1e" }}>{selectedProperty.details?.bedrooms || 0}</p>
                                                        <p style={{ color: "#211e1e" }}>{selectedProperty.details?.bathrooms || 0}</p>
                                                        <p style={{ color: "#211e1e" }}>{selectedProperty.details?.area_sqft || 0} sq ft</p>
                                                        <p style={{ color: "#211e1e" }}>{selectedProperty.details?.year_built || "N/A"}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        {/* Description */}
                                        <div className="mb-4">
                                            <h6>Description</h6>
                                            <div className="card">
                                                <div className="card-body">
                                                    <p className="mb-0" style={{ color: "#211e1e" }}>
                                                        {selectedProperty.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Features */}
                                        {selectedProperty.features && selectedProperty.features.length > 0 && (
                                            <div className="mb-4">
                                                <h6>🏠 Property Features</h6>
                                                <div className="card">
                                                    <div className="card-body">
                                                        <div className="d-flex flex-wrap gap-1">
                                                            {selectedProperty.features.map((feature, index) => (
                                                                <span key={index} className="badge bg-primary me-1 mb-1">
                                                                    {formatText(feature)}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Amenities */}
                                        {selectedProperty.amenities && selectedProperty.amenities.length > 0 && (
                                            <div className="mb-4">
                                                <h6>⭐ Amenities</h6>
                                                <div className="card">
                                                    <div className="card-body">
                                                        <div className="d-flex flex-wrap gap-1">
                                                            {selectedProperty.amenities.map((amenity, index) => (
                                                                <span key={index} className="badge bg-success me-1 mb-1">
                                                                    {formatText(amenity)}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Address */}
                                        <div className="mb-4">
                                            <h6>📍 Address</h6>
                                            <div className="card">
                                                <div className="card-body">
                                                    <p className="mb-1" style={{ color: "#211e1e" }}>
                                                        {selectedProperty.address?.street}
                                                    </p>
                                                    <p className="mb-1" style={{ color: "#211e1e" }}>
                                                        {selectedProperty.address?.city}, {selectedProperty.address?.state} {selectedProperty.address?.zip_code}
                                                    </p>
                                                    <p className="mb-0" style={{ color: "#211e1e" }}>
                                                        {selectedProperty.address?.country}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Seller Info */}
                                        <div className="mb-4">
                                            <h6>👤 Seller Information</h6>
                                            <div className="card">
                                                <div className="card-body">
                                                    <p className="mb-1" style={{ color: "#211e1e" }}>
                                                        <strong>Name:</strong> {selectedProperty.seller_id?.profile?.first_name} {selectedProperty.seller_id?.profile?.last_name}
                                                    </p>
                                                    <p className="mb-1" style={{ color: "#211e1e" }}>
                                                        <strong>Email:</strong> {selectedProperty.seller_id?.email}
                                                    </p>
                                                    <p className="mb-0" style={{ color: "#211e1e" }}>
                                                        <strong>Phone:</strong> {selectedProperty.seller_id?.profile?.phone_number || "Not provided"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowPreview(false)}>
                                    Close Preview
                                </button>
                                {selectedProperty.status === "pending" && (
                                    <div className="btn-group">
                                        <button
                                            className="btn btn-success"
                                            onClick={() => {
                                                handleApprove(getPropertyId(selectedProperty));
                                                setShowPreview(false);
                                            }}
                                        >
                                            ✅ Approve Property
                                        </button>
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => {
                                                handleReject(getPropertyId(selectedProperty));
                                                setShowPreview(false);
                                            }}
                                        >
                                            ❌ Reject Property
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminDashboard;
