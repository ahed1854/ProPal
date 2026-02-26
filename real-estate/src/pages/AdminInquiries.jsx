import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const AdminInquiries = () => {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [showActionModal, setShowActionModal] = useState(false);
    const [actionNote, setActionNote] = useState("");
    const [selectedAction, setSelectedAction] = useState("");
    const [responseMessage, setResponseMessage] = useState("");
    const [showResponseForm, setShowResponseForm] = useState(false);

    const { user } = useAuth();

    useEffect(() => {
        if (user?.role === "admin") {
            loadInquiries();
        }
    }, [user]);

    const loadInquiries = async () => {
        setLoading(true);
        try {
            const response = await api.getAdminInquiries();
            if (response.success) {
                setInquiries(response.data);
            }
        } catch (error) {
            console.error("Error loading inquiries:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (action) => {
        if (!selectedInquiry) return;

        try {
            let response;

            if (action === "admin_handling") {
                // When admin chooses to handle personally, show response form immediately
                setShowActionModal(false);
                setShowResponseForm(true);
                testAllEndpoints();

                return; // Don't proceed with API call yet
            } else if (action === "responded") {
                // For responded action, we need to send the response message
                if (!responseMessage.trim()) {
                    alert("Please enter a response message for the buyer");
                    return;
                }

                response = await api.updateInquiryStatus(selectedInquiry._id?.$oid || selectedInquiry._id, action, actionNote, responseMessage);
            } else {
                response = await api.updateInquiryStatus(selectedInquiry._id?.$oid || selectedInquiry._id, action, actionNote);
            }

            if (response.success) {
                setShowActionModal(false);
                setShowResponseForm(false);
                setActionNote("");
                setResponseMessage("");
                setSelectedAction("");
                loadInquiries();
            }
        } catch (error) {
            console.error("Error updating inquiry:", error);
        }
    };

    const handleAdminResponse = async () => {
        if (!selectedInquiry || !responseMessage.trim()) {
            alert("Please enter a response message");
            return;
        }

        try {
            console.log("Sending response for inquiry:", selectedInquiry._id);
            const inquiryId = selectedInquiry._id?.$oid || selectedInquiry._id;

            // Use the new dedicated response endpoint
            const response = await api.sendInquiryResponse(inquiryId, responseMessage, actionNote);

            if (response.success) {
                console.log("Response saved successfully:", response);
                setShowResponseForm(false);
                setActionNote("");
                setResponseMessage("");
                setSelectedInquiry(null);

                // Reload and show success
                await loadInquiries();
                alert("✅ Response sent successfully to buyer!");
            } else {
                console.error("Failed to save response:", response);
                alert("❌ Failed to save response: " + (response.error || "Unknown error"));
            }
        } catch (error) {
            console.error("Error sending admin response:", error);
            alert("❌ Error: " + error.message);
        }
    };

    // ---------------------------------------------------------------------------

    const openActionModal = (inquiry, action) => {
        setSelectedInquiry(inquiry);
        setSelectedAction(action);
        setActionNote("");
        setResponseMessage("");
        setShowActionModal(true);
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending_admin_review: { class: "bg-warning", text: "Pending Review" },
            forwarded_to_seller: { class: "bg-info", text: "Forwarded to Seller" },
            admin_handling: { class: "bg-primary", text: "Admin Handling" },
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
        return dateObj.toLocaleDateString() + " " + dateObj.toLocaleTimeString();
    };

    const getActionButtons = (inquiry) => {
        if (inquiry.status === "pending_admin_review") {
            return (
                <div className="btn-group-vertical btn-group-sm">
                    <button className="btn btn-success btn-sm mb-1" onClick={() => openActionModal(inquiry, "forwarded_to_seller")}>
                        📨 Forward to Seller
                    </button>
                    <button className="btn btn-primary btn-sm mb-1" onClick={() => openActionModal(inquiry, "admin_handling")}>
                        👤 Handle & Respond
                    </button>
                    <button className="btn btn-secondary btn-sm mb-1" onClick={() => openActionModal(inquiry, "closed")}>
                        ✅ Mark as Closed
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => openActionModal(inquiry, "rejected")}>
                        ❌ Reject Inquiry
                    </button>
                </div>
            );
        } else if (inquiry.status === "admin_handling" || inquiry.status === "forwarded_to_seller") {
            return (
                <div className="btn-group-vertical btn-group-sm">
                    <button
                        className="btn btn-success btn-sm mb-1"
                        onClick={() => {
                            setSelectedInquiry(inquiry);
                            setShowResponseForm(true);
                            testAllEndpoints();
                        }}
                    >
                        💬 Send Response
                    </button>
                    <button className="btn btn-secondary btn-sm" onClick={() => openActionModal(inquiry, "closed")}>
                        🔒 Close Inquiry
                    </button>
                </div>
            );
        }
        return <span className="text-muted-2">No actions available</span>;
    };

    const testAllEndpoints = async () => {
        if (!selectedInquiry) return;

        const inquiryId = selectedInquiry._id?.$oid || selectedInquiry._id;
        const baseURL = "http://localhost:5000/api";
        const endpoints = [`/inquiries/${inquiryId}/status`, `/inquiries/${inquiryId}`, `/inquiries/${inquiryId}/respond`, `/inquiries/respond`, `/inquiries`];

        console.log("=== Testing ALL Inquiry Endpoints ===");

        for (const endpoint of endpoints) {
            try {
                // Test GET
                const getResponse = await fetch(`${baseURL}${endpoint}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("realestate_token")}`,
                        "Content-Type": "application/json",
                    },
                });
                const getText = await getResponse.text();
                console.log(`GET ${endpoint}: Status ${getResponse.status}`);

                // Test PATCH
                const patchResponse = await fetch(`${baseURL}${endpoint}`, {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("realestate_token")}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ test: true }),
                });
                const patchText = await patchResponse.text();
                console.log(`PATCH ${endpoint}: Status ${patchResponse.status}`);
            } catch (error) {
                console.log(`Error with ${endpoint}:`, error.message);
            }
        }
    };

    return (
        <>
            <div className="dashboard-header">
                <div className="container">
                    <h1>Admin Inquiries Dashboard</h1>
                    <p>Manage buyer inquiries and coordinate with sellers</p>
                </div>
            </div>
            <div className="container mt-4">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-body">
                                {/* Statistics */}
                                <div className="row mb-4">
                                    <div className="col-md-2">
                                        <div className="card text-center">
                                            <div className="card-body">
                                                <h3>{inquiries.length}</h3>
                                                <p className="text-muted">Total Inquiries</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <div className="card text-center">
                                            <div className="card-body">
                                                <h3 className="text-warning">{inquiries.filter((i) => i.status === "pending_admin_review").length}</h3>
                                                <p className="text-muted">Pending Review</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <div className="card text-center">
                                            <div className="card-body">
                                                <h3 className="text-info">{inquiries.filter((i) => i.status === "forwarded_to_seller").length}</h3>
                                                <p className="text-muted">Forwarded</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <div className="card text-center">
                                            <div className="card-body">
                                                <h3 className="text-primary">{inquiries.filter((i) => i.status === "admin_handling").length}</h3>
                                                <p className="text-muted">Admin Handling</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <div className="card text-center">
                                            <div className="card-body">
                                                <h3 className="text-success">{inquiries.filter((i) => i.status === "responded").length}</h3>
                                                <p className="text-muted">Responded</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <div className="card text-center">
                                            <div className="card-body">
                                                <h3 className="text-secondary">{inquiries.filter((i) => i.status === "closed").length}</h3>
                                                <p className="text-muted">Closed</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Inquiries Table */}
                                {loading ? (
                                    <div className="text-center py-4">
                                        <div className="spinner-border" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                        <p className="mt-2">Loading inquiries...</p>
                                    </div>
                                ) : inquiries.length === 0 ? (
                                    <div className="text-center py-5">
                                        <div className="display-1 text-muted-2 mb-3">📋</div>
                                        <h5>No inquiries yet</h5>
                                        <p className="text-muted-2">Buyer inquiries will appear here when they contact you about properties.</p>
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-striped table-hover">
                                            <thead className="table-dark">
                                                <tr>
                                                    <th>Property</th>
                                                    <th>Buyer</th>
                                                    <th>Message</th>
                                                    <th>Original Seller</th>
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
                                                                <Link to={`/property/${inquiry.property_id._id?.$oid || inquiry.property_id._id}`} target="_blank">
                                                                    {inquiry.property_id.title}
                                                                </Link>
                                                            </strong>
                                                            <br />
                                                            <small className="text-muted-2">
                                                                {inquiry.property_id.address?.city}, {inquiry.property_id.address?.state}
                                                            </small>
                                                        </td>
                                                        <td>
                                                            <div>
                                                                <strong>
                                                                    {inquiry.buyer_id?.profile?.first_name} {inquiry.buyer_id?.profile?.last_name}
                                                                </strong>
                                                                <br />
                                                                <small className="text-muted-2">{inquiry.buyer_id?.email}</small>
                                                                <br />
                                                                <small className="text-muted-2">Phone: {inquiry.buyer_id?.profile?.phone_number || "Not provided"}</small>
                                                            </div>
                                                        </td>
                                                        <td style={{ maxWidth: "200px" }}>
                                                            <div className="mb-2">
                                                                <strong>Type:</strong> {inquiry.inquiry_type}
                                                            </div>
                                                            <p className="mb-1">{inquiry.message}</p>
                                                            {inquiry.admin_note && (
                                                                <div className="mt-2 p-2 bg-light rounded">
                                                                    <small>
                                                                        <strong>Admin Note:</strong> {inquiry.admin_note}
                                                                    </small>
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <div>
                                                                <strong>
                                                                    {inquiry.original_seller_id?.profile?.first_name} {inquiry.original_seller_id?.profile?.last_name}
                                                                </strong>
                                                                <br />
                                                                <small className="text-muted-2">{inquiry.original_seller_id?.email}</small>
                                                                <br />
                                                                <small className="text-muted-2">{inquiry.original_seller_id?.profile?.phone_number || "No phone"}</small>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <span className="text-capitalize">{inquiry.contact_preference}</span>
                                                        </td>
                                                        <td>{getStatusBadge(inquiry.status)}</td>
                                                        <td>{formatDate(inquiry.created_at)}</td>
                                                        <td style={{ minWidth: "200px" }}>{getActionButtons(inquiry)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Modal */}
            {showActionModal && selectedInquiry && (
                <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {selectedAction === "forwarded_to_seller" && "📨 Forward to Seller"}
                                    {selectedAction === "admin_handling" && "👤 Handle Personally & Respond"}
                                    {selectedAction === "closed" && "🔒 Close Inquiry"}
                                    {selectedAction === "rejected" && "❌ Reject Inquiry"}
                                </h5>
                                <button type="button" className="btn-close" onClick={() => setShowActionModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <p>
                                        <strong>Property:</strong> {selectedInquiry.property_id.title}
                                    </p>
                                    <p>
                                        <strong>Buyer:</strong> {selectedInquiry.buyer_id?.profile?.first_name} {selectedInquiry.buyer_id?.profile?.last_name}
                                    </p>
                                    <p>
                                        <strong>Current Status:</strong> {getStatusBadge(selectedInquiry.status)}
                                    </p>
                                </div>

                                {/* Show different content based on action */}
                                {selectedAction === "admin_handling" ? (
                                    <div className="alert alert-info">
                                        <strong>You are about to handle this inquiry personally.</strong>
                                        <p className="mb-0 mt-2">After confirming, you will be prompted to send an immediate response to the buyer.</p>
                                    </div>
                                ) : (
                                    <div className="mb-3">
                                        <label className="form-label">Internal Note (Optional)</label>
                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            value={actionNote}
                                            onChange={(e) => setActionNote(e.target.value)}
                                            placeholder="Add any internal notes about this action..."
                                        />
                                    </div>
                                )}

                                <div className="alert alert-info">
                                    <small>
                                        {selectedAction === "forwarded_to_seller" && "This will forward the inquiry to the original seller and notify them."}
                                        {selectedAction === "admin_handling" && "You will take responsibility for handling this inquiry personally and will send an immediate response to the buyer."}
                                        {selectedAction === "closed" && "Close this inquiry as completed or no longer relevant."}
                                        {selectedAction === "rejected" && "Reject this inquiry if it is not appropriate or valid."}
                                    </small>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowActionModal(false)}>
                                    Cancel
                                </button>
                                <button type="button" className="btn btn-primary" onClick={() => handleAction(selectedAction)}>
                                    {selectedAction === "admin_handling" ? "Continue to Response" : "Confirm Action"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showResponseForm && selectedInquiry && (
                <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">💬 Send Response to Buyer</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => {
                                        setShowResponseForm(false);
                                        setResponseMessage("");
                                        setActionNote("");
                                    }}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <p>
                                        <strong>Property:</strong> {selectedInquiry.property_id.title}
                                    </p>
                                    <p>
                                        <strong>Buyer:</strong> {selectedInquiry.buyer_id?.profile?.first_name} {selectedInquiry.buyer_id?.profile?.last_name}
                                    </p>
                                    <p>
                                        <strong>Buyer's Message:</strong> "{selectedInquiry.message}"
                                    </p>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Your Response to Buyer *</label>
                                    <textarea
                                        className="form-control"
                                        rows="5"
                                        value={responseMessage}
                                        onChange={(e) => setResponseMessage(e.target.value)}
                                        placeholder="Type your response to the buyer here. This message will be visible to them."
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Internal Note (Optional)</label>
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        value={actionNote}
                                        onChange={(e) => setActionNote(e.target.value)}
                                        placeholder="Add any internal notes about this response..."
                                    />
                                </div>

                                <div className="alert alert-warning">
                                    <small>
                                        <strong>Note:</strong> This response will be sent to the buyer and they will be able to see it in their dashboard. The inquiry status will be updated to
                                        "Responded".
                                    </small>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setShowResponseForm(false);
                                        setResponseMessage("");
                                        setActionNote("");
                                    }}
                                >
                                    Cancel
                                </button>
                                <button type="button" className="btn btn-primary" onClick={handleAdminResponse} disabled={!responseMessage.trim()}>
                                    Send Response to Buyer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminInquiries;
