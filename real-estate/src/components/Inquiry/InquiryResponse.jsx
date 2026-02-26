// src/components/Inquiry/InquiryResponse.jsx
import React, { useState } from "react";
import api from "../../services/api";

const InquiryResponse = ({ inquiry, userRole, onResponseSent }) => {
    const [showResponseForm, setShowResponseForm] = useState(false);
    const [responseMessage, setResponseMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSendResponse = async () => {
        if (!responseMessage.trim()) return;

        setLoading(true);
        try {
            const response = await api.updateInquiryResponse(inquiry._id?.$oid || inquiry._id, responseMessage);

            if (response.success) {
                setResponseMessage("");
                setShowResponseForm(false);
                onResponseSent?.();
            }
        } catch (error) {
            console.error("Error sending response:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="inquiry-response">
            {/* Display existing response */}
            {inquiry.response_message && (
                <div className="card mt-3">
                    <div className="card-header bg-light">
                        <strong>{userRole === "buyer" ? "Admin Response" : "Your Response"}</strong>
                    </div>
                    <div className="card-body">
                        <p className="mb-0">{inquiry.response_message}</p>
                        {inquiry.response_date && <small className="text-muted">Responded on: {new Date(inquiry.response_date).toLocaleDateString()}</small>}
                    </div>
                </div>
            )}

            {/* Response form for admin/seller */}
            {(userRole === "admin" || userRole === "seller") && inquiry.status !== "closed" && (
                <div className="mt-3">
                    {!showResponseForm ? (
                        <button className="btn btn-outline-primary btn-sm" onClick={() => setShowResponseForm(true)}>
                            📝 Send Response
                        </button>
                    ) : (
                        <div className="card">
                            <div className="card-header">
                                <strong>Send Response to Buyer</strong>
                            </div>
                            <div className="card-body">
                                <textarea
                                    className="form-control mb-2"
                                    rows="4"
                                    placeholder="Type your response to the buyer..."
                                    value={responseMessage}
                                    onChange={(e) => setResponseMessage(e.target.value)}
                                />
                                <div className="d-flex gap-2">
                                    <button className="btn btn-primary btn-sm" onClick={handleSendResponse} disabled={loading || !responseMessage.trim()}>
                                        {loading ? "Sending..." : "Send Response"}
                                    </button>
                                    <button
                                        className="btn btn-outline-secondary btn-sm"
                                        onClick={() => {
                                            setShowResponseForm(false);
                                            setResponseMessage("");
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default InquiryResponse;
