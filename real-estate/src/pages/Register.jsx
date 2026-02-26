import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        role: "buyer",
        profile: {
            first_name: "",
            last_name: "",
            phone_number: "",
        },
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith("profile.")) {
            const field = name.split(".")[1];
            setFormData((prev) => ({
                ...prev,
                profile: {
                    ...prev.profile,
                    [field]: value,
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        const { confirmPassword, ...userData } = formData;
        const result = await register(userData);

        if (result.success) {
            navigate("/login");
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    return (
        <div className="register-page-container">
            <div className="register-header">
                <span className="register-icon">🏠</span>
                <h1 className="register-title">Register</h1>
            </div>
            
            <div className="register-card-wrapper">
                <div className="register-card">
                    <form onSubmit={handleSubmit} className="register-form">
                        {error && <div className="alert alert-danger">{error}</div>}
                        
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label-white">First name</label>
                                <input 
                                    type="text" 
                                    className="form-control-register" 
                                    name="profile.first_name" 
                                    value={formData.profile.first_name} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                            
                            <div className="form-group">
                                <label className="form-label-white">Last name</label>
                                <input 
                                    type="text" 
                                    className="form-control-register" 
                                    name="profile.last_name" 
                                    value={formData.profile.last_name} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label className="form-label-white">Email</label>
                            <input 
                                type="email" 
                                className="form-control-register" 
                                name="email" 
                                value={formData.email} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        
                        <div className="form-group">
                            <label className="form-label-white">phone number</label>
                            <input 
                                type="tel" 
                                className="form-control-register" 
                                name="profile.phone_number" 
                                value={formData.profile.phone_number} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        
                        <div className="form-group">
                            <label className="form-label-white">Role</label>
                            <select 
                                className="form-control-register" 
                                name="role" 
                                value={formData.role} 
                                onChange={handleChange} 
                                required
                            >
                                <option value="buyer">Buyer</option>
                                <option value="seller">Seller</option>
                            </select>
                        </div>
                        
                        <div className="form-group">
                            <label className="form-label-white">Password</label>
                            <input 
                                type="password" 
                                className="form-control-register" 
                                name="password" 
                                value={formData.password} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        
                        <div className="form-group">
                            <label className="form-label-white">Confirm Password</label>
                            <input 
                                type="password" 
                                className="form-control-register" 
                                name="confirmPassword" 
                                value={formData.confirmPassword} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                    </form>
                </div>
                
                <div className="register-login-link">
                    <p>
                        Already have an account?{" "}
                        <Link to="/login" className="login-link">Login here</Link>
                    </p>
                </div>
                
                <button 
                    type="submit" 
                    className="btn-register-main" 
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? "Creating Account..." : "Register"}
                </button>
            </div>
        </div>
    );
};

export default Register;
