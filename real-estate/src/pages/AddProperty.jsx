import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./AddProperty.css";

const AddProperty = () => {
    // 1. Main Form State
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        property_type: "apartment",
        transaction_type: "sale",
        price: "",
        address: {
            street: "",
            city: "",
            state: "",
            zip_code: "",
        },
        details: {
            bedrooms: "",
            bathrooms: "",
            area_sqft: "",
            year_built: "",
            lot_size: "",
            parking_spaces: "",
            has_garage: false,
            balconies: "",
        },
        features: [],
        amenities: [],
    });

    // 2. Image Handling State
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [tempFile, setTempFile] = useState(null);
    const [tempCaption, setTempCaption] = useState("");
    const [tempPreview, setTempPreview] = useState("");

    // 3. UI State
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [newFeature, setNewFeature] = useState("");
    const [newAmenity, setNewAmenity] = useState("");

    const { user } = useAuth();
    const navigate = useNavigate();

    // --- HANDLERS ---

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.includes(".")) {
            const [parent, child] = name.split(".");
            setFormData((prev) => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: type === "checkbox" ? checked : value,
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: type === "checkbox" ? checked : value,
            }));
        }
    };

    // --- FEATURE HANDLERS ---
    const addFeature = () => {
        if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
            setFormData((prev) => ({
                ...prev,
                features: [...prev.features, newFeature.trim()],
            }));
            setNewFeature("");
        }
    };

    const removeFeature = (featureToRemove) => {
        setFormData((prev) => ({
            ...prev,
            features: prev.features.filter((feature) => feature !== featureToRemove),
        }));
    };

    // --- AMENITY HANDLERS ---
    const addAmenity = () => {
        if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
            setFormData((prev) => ({
                ...prev,
                amenities: [...prev.amenities, newAmenity.trim()],
            }));
            setNewAmenity("");
        }
    };

    const removeAmenity = (amenityToRemove) => {
        setFormData((prev) => ({
            ...prev,
            amenities: prev.amenities.filter((amenity) => amenity !== amenityToRemove),
        }));
    };

    // --- IMAGE HANDLERS (MULTER) ---

    // 1. Select a file from device
    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setTempFile(file);
            setTempPreview(URL.createObjectURL(file));
        }
    };

    // 2. Add file to the list of images to upload
    const addImage = () => {
        if (tempFile) {
            const newImageObj = {
                file: tempFile,
                caption: tempCaption || "Property Image",
                preview: tempPreview,
                is_primary: selectedFiles.length === 0, // First one is primary by default
            };

            setSelectedFiles([...selectedFiles, newImageObj]);

            // Reset temp inputs
            setTempFile(null);
            setTempCaption("");
            setTempPreview("");
            // Clear the file input visually
            document.getElementById("imageInput").value = "";
        }
    };

    // 3. Remove image from list
    const removeImage = (indexToRemove) => {
        setSelectedFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
    };

    // 4. Set primary image
    const setPrimaryImage = (index) => {
        setSelectedFiles((prev) =>
            prev.map((img, i) => ({
                ...img,
                is_primary: i === index,
            }))
        );
    };

    // --- SUBMIT ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (selectedFiles.length === 0) {
            setError("Please add at least one image for the property.");
            setLoading(false);
            return;
        }

        try {
            // Create FormData object for Multipart upload
            const data = new FormData();

            // Append simple fields
            data.append("title", formData.title);
            data.append("description", formData.description);
            data.append("property_type", formData.property_type);
            data.append("transaction_type", formData.transaction_type);
            data.append("price", formData.price);

            // Append Nested Objects (Must be stringified for FormData)
            data.append("address", JSON.stringify(formData.address));

            const formattedDetails = {
                ...formData.details,
                bedrooms: parseInt(formData.details.bedrooms) || 0,
                bathrooms: parseInt(formData.details.bathrooms) || 0,
                area_sqft: parseFloat(formData.details.area_sqft) || 0,
                year_built: parseInt(formData.details.year_built) || null,
                lot_size: parseFloat(formData.details.lot_size) || null,
                parking_spaces: parseInt(formData.details.parking_spaces) || 0,
            };
            data.append("details", JSON.stringify(formattedDetails));

            data.append("features", JSON.stringify(formData.features));
            data.append("amenities", JSON.stringify(formData.amenities));

            // Append Images and Metadata
            const imageMetadata = [];

            selectedFiles.forEach((imgObj) => {
                // 'propertyImages' must match the name in backend upload.array()
                data.append("propertyImages", imgObj.file);

                // Collect metadata (captions/primary status)
                imageMetadata.push({
                    caption: imgObj.caption,
                    is_primary: imgObj.is_primary,
                });
            });

            data.append("imageMetadata", JSON.stringify(imageMetadata));

            // Send to backend
            const response = await api.createProperty(data);

            if (response.success) {
                navigate("/seller");
            } else {
                setError(response.error || "Failed to create property");
            }
        } catch (err) {
            console.error(err);
            setError(err.message || "Failed to create property");
        }
        setLoading(false);
    };

    // Common lists for suggestions
    const commonFeatures = ["balcony", "city_view", "garden", "pool", "fireplace", "hardwood_floors", "updated_kitchen", "finished_basement", "walk_in_closet", "home_office"];
    const commonAmenities = ["air_conditioning", "heating", "dishwasher", "washer_dryer", "gym", "concierge", "parking", "elevator", "security_system", "pet_friendly"];

    return (
        <div className="add-property-page">
            <div className="add-property-container">
                <h1 className="add-property-title">ADD NEW PROPERTIES</h1>
                
                <div className="add-property-card">
                    {error && <div className="alert-danger-add">{error}</div>}
                    
                    <form onSubmit={handleSubmit} className="add-property-form">
                        {/* First Row: Properties title and Properties type */}
                        <div className="form-row-add">
                            <div className="form-group-add">
                                <label className="form-label-add">Properties title</label>
                                <input 
                                    type="text" 
                                    className="form-control-add" 
                                    name="title" 
                                    value={formData.title} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                            <div className="form-group-add">
                                <label className="form-label-add">Properties type</label>
                                <select 
                                    className="form-control-add" 
                                    name="property_type" 
                                    value={formData.property_type} 
                                    onChange={handleChange} 
                                    required
                                >
                                    <option value="apartment">Apartment</option>
                                    <option value="house">House</option>
                                    <option value="condo">Condo</option>
                                    <option value="villa">Villa</option>
                                    <option value="Store">Store</option>
                                    <option value="office">office</option>
                                </select>
                            </div>
                        </div>

                        {/* Transaction Type: Radio Buttons */}
                        <div className="form-group-add">
                            <label className="form-label-add">Transaction type</label>
                            <div className="transaction-type-group">
                                <div className="radio-group">
                                    <input 
                                        type="radio" 
                                        id="rent" 
                                        name="transaction_type" 
                                        value="rent" 
                                        checked={formData.transaction_type === "rent"}
                                        onChange={handleChange}
                                        className="radio-input"
                                    />
                                    <label htmlFor="rent" className="radio-label">Rent</label>
                                </div>
                                <div className="radio-group">
                                    <input 
                                        type="radio" 
                                        id="sale" 
                                        name="transaction_type" 
                                        value="sale" 
                                        checked={formData.transaction_type === "sale"}
                                        onChange={handleChange}
                                        className="radio-input"
                                    />
                                    <label htmlFor="sale" className="radio-label">Sale</label>
                                </div>
                            </div>
                        </div>

                        {/* Price with $ Symbol */}
                        <div className="form-group-add">
                            <label className="form-label-add">Price</label>
                            <div className="price-input-wrapper">
                                <input 
                                    type="number" 
                                    className="form-control-add price-input" 
                                    name="price" 
                                    value={formData.price} 
                                    onChange={handleChange} 
                                    required 
                                />
                                <span className="price-symbol">$</span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="form-group-add">
                            <label className="form-label-add">Description</label>
                            <textarea 
                                className="form-control-add textarea-add" 
                                name="description" 
                                value={formData.description} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>

                        {/* Add Photo Section */}
                        {/* <div 
                            className="add-photo-section"
                            onClick={() => document.getElementById("imageInput").click()}
                        >
                            <span className="add-photo-text">Add photo</span>
                            <div className="add-photo-icon">📷</div>
                            <input 
                                type="file" 
                                id="imageInput" 
                                style={{ display: "none" }} 
                                accept="image/*" 
                                onChange={handleFileSelect} 
                            />
                        </div> */}
                        
                        {/* Image Preview and Management */}
                        {/* {selectedFiles.length > 0 && (
                            <div style={{ marginBottom: "20px" }}>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                                    {selectedFiles.map((img, index) => (
                                        <div key={index} style={{ position: "relative", width: "100px", height: "100px" }}>
                                            <img 
                                                src={img.preview} 
                                                alt="Preview" 
                                                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }} 
                                            />
                                            <button 
                                                type="button" 
                                                onClick={() => removeImage(index)}
                                                style={{
                                                    position: "absolute",
                                                    top: "-5px",
                                                    right: "-5px",
                                                    background: "rgba(220, 53, 69, 0.8)",
                                                    border: "none",
                                                    borderRadius: "50%",
                                                    width: "24px",
                                                    height: "24px",
                                                    color: "white",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                {tempFile && (
                                    <div style={{ marginTop: "10px", display: "flex", gap: "10px", alignItems: "center" }}>
                                        <input 
                                            type="text" 
                                            className="form-control-add" 
                                            style={{ flex: 1 }}
                                            value={tempCaption}
                                            onChange={(e) => setTempCaption(e.target.value)}
                                            placeholder="Image caption"
                                        />
                                        <button type="button" className="btn-add" onClick={addImage}>
                                            Add
                                        </button>
                                    </div>
                                )}
                            </div>
                        )} */}

                                {/* --- IMAGES SECTION (Updated) --- */}
                                <div className="card mb-4">
                                    <div className="card-header">
                                        <h5 className="mb-0">📷 Property Images</h5>
                                        <small className="text-muted">Upload images from your device.</small>
                                    </div>
                                    <div className="card-body">
                                        {/* Add Image Form */}
                                        <div className="row mb-3 align-items-end">
                                            <div className="col-md-5">
                                                <label className="form-label">Select Image *</label>
                                                <input type="file" id="imageInput" className="form-control" accept="image/*" onChange={handleFileSelect} />
                                            </div>
                                            <div className="col-md-5">
                                                <label className="form-label">Caption</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={tempCaption}
                                                    onChange={(e) => setTempCaption(e.target.value)}
                                                    placeholder="Living room, exterior, etc."
                                                />
                                            </div>
                                            <div className="col-md-2">
                                                <button type="button" className="btn btn-outline-primary w-100" onClick={addImage} disabled={!tempFile}>
                                                    Add
                                                </button>
                                            </div>
                                        </div>

                                        {/* Preview Selected Images */}
                                        {selectedFiles.length > 0 && (
                                            <div className="mt-4">
                                                <h6>Selected Images ({selectedFiles.length})</h6>
                                                <div className="row">
                                                    {selectedFiles.map((img, index) => (
                                                        <div key={index} className="col-md-4 mb-3">
                                                            <div className={`card ${img.is_primary ? "border-primary" : ""}`}>
                                                                <img src={img.preview} className="card-img-top" alt="Preview" style={{ height: "150px", objectFit: "cover" }} />
                                                                <div className="card-body p-2">
                                                                    <small className="card-text d-block text-truncate">{img.caption}</small>
                                                                    {img.is_primary && <small className="text-primary fw-bold">★ Primary</small>}

                                                                    <div className="d-flex gap-2 mt-2">
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-sm btn-outline-primary flex-grow-1"
                                                                            onClick={() => setPrimaryImage(index)}
                                                                            disabled={img.is_primary}
                                                                        >
                                                                            Main
                                                                        </button>
                                                                        <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeImage(index)}>
                                                                            Remove
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Features Section */}
                                <div className="card mb-4">
                                    <div className="card-header">
                                        <h5 className="mb-0">Features</h5>
                                    </div>
                                    <div className="card-body">
                                        <div className="mb-3">
                                            <label className="form-label">Add Feature</label>
                                            <div className="input-group">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={newFeature}
                                                    onChange={(e) => setNewFeature(e.target.value)}
                                                    placeholder="e.g., balcony, garden..."
                                                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                                                />
                                                <button type="button" className="btn btn-outline-primary" onClick={addFeature}>
                                                    Add
                                                </button>
                                            </div>
                                            <small className="text-muted">Common: {commonFeatures.join(", ")}</small>
                                        </div>
                                        {formData.features.length > 0 && (
                                            <div className="d-flex flex-wrap gap-2 mt-2">
                                                {formData.features.map((feature, index) => (
                                                    <span key={index} className="badge bg-primary d-flex align-items-center">
                                                        {feature}
                                                        <button type="button" className="btn-close btn-close-white ms-2" style={{ fontSize: "0.6rem" }} onClick={() => removeFeature(feature)}></button>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Amenities Section */}
                                <div className="card mb-4">
                                    <div className="card-header">
                                        <h5 className="mb-0">Amenities</h5>
                                    </div>
                                    <div className="card-body">
                                        <div className="mb-3">
                                            <label className="form-label">Add Amenity</label>
                                            <div className="input-group">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={newAmenity}
                                                    onChange={(e) => setNewAmenity(e.target.value)}
                                                    placeholder="e.g., gym, pool..."
                                                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addAmenity())}
                                                />
                                                <button type="button" className="btn btn-outline-primary" onClick={addAmenity}>
                                                    Add
                                                </button>
                                            </div>
                                            <small className="text-muted">Common: {commonAmenities.join(", ")}</small>
                                        </div>
                                        {formData.amenities.length > 0 && (
                                            <div className="d-flex flex-wrap gap-2 mt-2">
                                                {formData.amenities.map((amenity, index) => (
                                                    <span key={index} className="badge bg-success d-flex align-items-center">
                                                        {amenity}
                                                        <button type="button" className="btn-close btn-close-white ms-2" style={{ fontSize: "0.6rem" }} onClick={() => removeAmenity(amenity)}></button>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                        {/* Address: City and Street */}
                        <div className="address-row">
                            <div className="form-group-add">
                                <label className="form-label-add">City</label>
                                <select 
                                    className="form-control-add" 
                                    name="address.city" 
                                    value={formData.address.city} 
                                    onChange={handleChange} 
                                    required
                                >
                                    <option value="">Select City</option>
                                    <option value="Tartous">Tartous</option>
                                    <option value="Tartous Suburbs">Tartous Suburbs</option>
                               
                                </select>
                            </div>
                            <div className="form-group-add">
                                <label className="form-label-add">Street</label>
                                <select 
                                    className="form-control-add" 
                                    name="address.street" 
                                    value={formData.address.street} 
                                    onChange={handleChange} 
                                    required
                                >
                                    <option value="">Select Street</option>
                                    <option value="Bubai street">Bubai street</option>
                                    <option value="AlHamrat street">AlHamrat street</option>
                                    <option value="Park Road">Park Road</option>
                                    <option value="other">other</option>
                                </select>
                            </div>
                        </div>

                        {/* Property Details: Bedrooms, Bathrooms, Area, Balconies */}
                        <div className="details-row">
                            <div className="form-group-add">
                                <label className="form-label-add">Bedrooms</label>
                                <select 
                                    className="form-control-add" 
                                    name="details.bedrooms" 
                                    value={formData.details.bedrooms} 
                                    onChange={handleChange} 
                                    required
                                >
                                    <option value="">Select</option>
                                    {[0,1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                                        <option key={num} value={num}>{num}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group-add">
                                <label className="form-label-add">Bathrooms</label>
                                <select 
                                    className="form-control-add" 
                                    name="details.bathrooms" 
                                    value={formData.details.bathrooms} 
                                    onChange={handleChange} 
                                    required
                                >
                                    <option value="">Select</option>
                                    {[0,1, 2, 3, 4, 5, 6].map(num => (
                                        <option key={num} value={num}>{num}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group-add">
                                <label className="form-label-add">Area</label>
                                <select 
                                    className="form-control-add" 
                                    name="details.area_sqft" 
                                    value={formData.details.area_sqft} 
                                    onChange={handleChange} 
                                    required
                                >
                                    <option value="">Select</option>
                                    <option value="500">500 sq ft</option>
                                    <option value="1000">1000 sq ft</option>
                                    <option value="1500">1500 sq ft</option>
                                    <option value="2000">2000 sq ft</option>
                                    <option value="2500">2500+ sq ft</option>
                                </select>
                            </div>
                            <div className="form-group-add">
                                <label className="form-label-add">balconies</label>
                                <select 
                                    className="form-control-add" 
                                    name="details.balconies" 
                                    value={formData.details.balconies || ""} 
                                    onChange={handleChange}
                                >
                                    <option value="">Select</option>
                                    {[0, 1, 2, 3, 4].map(num => (
                                        <option key={num} value={num}>{num}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="action-buttons">
                            <button 
                                type="button" 
                                className="btn-cancel" 
                                onClick={() => navigate("/seller")}
                            >
                                cancel
                            </button>
                            <button 
                                type="submit" 
                                className="btn-add" 
                                disabled={loading}
                            >
                                {loading ? "Adding..." : "Add"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddProperty;
