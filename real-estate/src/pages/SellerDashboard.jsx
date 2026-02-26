import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const SellerDashboard = () => {
    const [properties, setProperties] = useState([]);
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [inquiriesLoading, setInquiriesLoading] = useState(false);
    const { user } = useAuth();

    const [showResponseModal, setShowResponseModal] = useState(false);
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [responseMessage, setResponseMessage] = useState("");

    // --- HELPER: Resolve Image URL ---
    const getImageUrl = (url) => {
        if (!url) return null;
        if (url.startsWith("http")) return url;
        return `http://localhost:5000${url}`;
    };

    useEffect(() => {
        loadProperties();
        loadInquiries();
    }, []);

    const loadProperties = async () => {
        setLoading(true);
        const response = await api.getProperties({
            seller_id: user._id,
        });

        if (response.success) {
            setProperties(response.data);
        }
        setLoading(false);
    };

    const loadInquiries = async () => {
        setInquiriesLoading(true);
        try {
            const response = await api.getSellerInquiries();
            if (response.success) {
                // Only show inquiries that have been forwarded to the seller
                const forwardedInquiries = response.data.filter((inquiry) => inquiry.status === "forwarded_to_seller");
                setInquiries(forwardedInquiries);
            }
        } catch (error) {
            console.error("Error loading inquiries:", error);
        } finally {
            setInquiriesLoading(false);
        }
    };

    const updateInquiryStatus = async (inquiryId, status, responseMessage = "") => {
        try {
            const response = await api.updateInquiryStatus(inquiryId, status, "", responseMessage);
            if (response.success) {
                loadInquiries();
            }
        } catch (error) {
            console.error("Error updating inquiry status:", error);
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: "warning",
            responded: "success",
            closed: "secondary",
            rejected: "danger",
            approved: "success",
        };
        const badgeColor = statusConfig[status] || "secondary";
        return `badge bg-${badgeColor}`;
    };

    const formatDate = (date) => {
        if (!date) return "N/A";
        const dateObj = date.$date ? new Date(date.$date) : new Date(date);
        return dateObj.toLocaleDateString();
    };

    const stats = {
        total: properties.length,
        approved: properties.filter((p) => p.status === "approved").length,
        pending: properties.filter((p) => p.status === "pending").length,
        rejected: properties.filter((p) => p.status === "rejected").length,
        inquiries: inquiries.length,
        pendingInquiries: inquiries.filter((i) => i.status === "pending").length,
    };

    return (
        <>
            <div className="dashboard-header">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h1>Seller Dashboard</h1>
                            <p>Manage your property listings and inquiries</p>
                        </div>
                        <Link to="/add-property" className="btn btn-primary">
                            + Add New Property
                        </Link>
                    </div>
                </div>
            </div>
            <div className="container mt-4">
                {/* Statistics */}
                <div className="row mb-4">
                    <div className="col-md-2">
                        <div className="card text-center">
                            <div className="card-body">
                                <h3>{stats.total}</h3>
                                <p className="text-muted">Total Properties</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="card text-center">
                            <div className="card-body">
                                <h3 className="text-success">{stats.approved}</h3>
                                <p className="text-muted">Approved</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="card text-center">
                            <div className="card-body">
                                <h3 className="text-warning">{stats.pending}</h3>
                                <p className="text-muted">Pending</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="card text-center">
                            <div className="card-body">
                                <h3 className="text-danger">{stats.rejected}</h3>
                                <p className="text-muted">Rejected</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="card text-center">
                            <div className="card-body">
                                <h3 className="text-primary">{stats.inquiries}</h3>
                                <p className="text-muted">Total Inquiries</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="card text-center">
                            <div className="card-body">
                                <h3 className="text-warning">{stats.pendingInquiries}</h3>
                                <p className="text-muted">Pending Inquiries</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Inquiries Section */}
                <div className="card mb-4">
                    <div className="card-header">
                        <h5 className="mb-0">📞 Property Inquiries</h5>
                    </div>
                    <div className="card-body">
                        {inquiriesLoading ? (
                            <div className="text-center">
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : inquiries.length === 0 ? (
                            <div className="text-center py-4">
                                <p className="text-muted">{inquiriesLoading ? "Loading..." : "No inquiries forwarded to you yet. Inquiries are first reviewed by our admin team."}</p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Property</th>
                                            <th>Buyer</th>
                                            <th>Message</th>
                                            <th>Type</th>
                                            <th>Contact Preference</th>
                                            <th>Status</th>
                                            <th>Date Received</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {inquiries.map((inquiry) => (
                                            <tr key={inquiry._id?.$oid || inquiry._id}>
                                                <td>
                                                    <strong>
                                                        <Link to={`/property/${inquiry.property_id._id?.$oid || inquiry.property_id._id}`}>{inquiry.property_id.title}</Link>
                                                    </strong>
                                                </td>
                                                <td>
                                                    {inquiry.buyer_id?.profile?.first_name} {inquiry.buyer_id?.profile?.last_name}
                                                    <br />
                                                    <small className="text-muted-2">{inquiry.buyer_id?.email}</small>
                                                </td>
                                                <td style={{ maxWidth: "200px" }}>
                                                    <p className="mb-1">{inquiry.message}</p>
                                                </td>
                                                <td>
                                                    <span className="text-capitalize">{inquiry.inquiry_type}</span>
                                                </td>
                                                <td>
                                                    <span className="text-capitalize">{inquiry.contact_preference}</span>
                                                </td>
                                                <td>
                                                    <span className={getStatusBadge(inquiry.status)}>{inquiry.status}</span>
                                                </td>
                                                <td>{formatDate(inquiry.created_at)}</td>
                                                <td>
                                                    {inquiry.status === "pending" && (
                                                        <div className="btn-group">
                                                            <button
                                                                className="btn btn-success btn-sm"
                                                                onClick={() => {
                                                                    setSelectedInquiry(inquiry);
                                                                    setShowResponseModal(true);
                                                                }}
                                                            >
                                                                Respond
                                                            </button>
                                                            <button className="btn btn-secondary btn-sm" onClick={() => updateInquiryStatus(inquiry._id?.$oid || inquiry._id, "closed")}>
                                                                Close
                                                            </button>
                                                        </div>
                                                    )}
                                                    {inquiry.status === "responded" && (
                                                        <button className="btn btn-secondary btn-sm" onClick={() => updateInquiryStatus(inquiry._id?.$oid || inquiry._id, "closed")}>
                                                            Close
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Properties List */}
                {loading ? (
                    <div className="text-center">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <div className="card">
                        <div className="card-header">
                            <h5 className="mb-0">My Properties</h5>
                        </div>
                        <div className="card-body">
                            {properties.length === 0 ? (
                                <div className="text-center py-4">
                                    <p className="text-muted">You haven't listed any properties yet.</p>
                                    <Link to="/add-property" className="btn btn-primary">
                                        List Your First Property
                                    </Link>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle">
                                        <thead>
                                            <tr>
                                                <th style={{ width: "80px" }}>Image</th>
                                                <th>Property</th>
                                                <th>Type</th>
                                                <th>Price</th>
                                                <th>Status</th>
                                                <th>Date Added</th>
                                            </tr>
                                        </thead>
                                        <tbody className="tablebody">
                                            {properties.map((property) => (
                                                <tr key={property._id}>
                                                    <td>
                                                        {property.images && property.images.length > 0 ? (
                                                            <img
                                                                src={getImageUrl(property.images.find((img) => img.is_primary)?.url || property.images[0].url)}
                                                                alt="Thumbnail"
                                                                className="rounded"
                                                                style={{ width: "60px", height: "60px", objectFit: "cover" }}
                                                                onError={(e) => {
                                                                    e.target.src = "https://placehold.co/60x60?text=No+Img";
                                                                }}
                                                            />
                                                        ) : (
                                                            <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{ width: "60px", height: "60px" }}>
                                                                🏠
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <strong>{property.title}</strong>
                                                        <br />
                                                        <small className="text-muted-2">
                                                            {property.address.city}, {property.address.state}
                                                        </small>
                                                    </td>
                                                    <td>
                                                        {property.property_type} - {property.transaction_type}
                                                    </td>
                                                    <td>
                                                        ${property.price.toLocaleString()}
                                                        {property.transaction_type === "rent" && "/month"}
                                                    </td>
                                                    <td>
                                                        <span className={getStatusBadge(property.status)}>{property.status}</span>
                                                    </td>
                                                    <td>{new Date(property.created_at).toLocaleDateString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default SellerDashboard;
