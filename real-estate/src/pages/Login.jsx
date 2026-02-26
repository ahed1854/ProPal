import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // Pass raw email and password.
            // The AuthContext will bundle them into an object.
            const result = await login(formData.email, formData.password);

            if (result.success) {
                navigate("/"); // Or dashboard based on role
            } else {
                setError(result.error || "Login failed");
            }
        } catch (err) {
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page-container">
            <div className="login-header">
                <span className="login-icon">🏠</span>
                <h1 className="login-title">LOG IN</h1>
            </div>
            
            <div className="login-card-wrapper">
                <div className="login-card">
                    <form onSubmit={handleSubmit} className="login-form">
                        {error && <div className="alert alert-danger">{error}</div>}
                        
                        <div className="form-group">
                            <label className="form-label-white">Email</label>
                            <input 
                                type="email" 
                                className="form-control-login" 
                                name="email" 
                                value={formData.email} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        
                        <div className="form-group">
                            <label className="form-label-white">Password</label>
                            <input 
                                type="password" 
                                className="form-control-login" 
                                name="password" 
                                value={formData.password} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                    </form>
                </div>
                
                <div className="login-register-link">
                    <p>
                        If you dont have an account{" "}
                        <Link to="/register" className="register-link">register here</Link>
                    </p>
                </div>
                
                <button 
                    type="submit" 
                    className="btn-login-main" 
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "LOG IN"}
                </button>
            </div>
        </div>
    );
};

export default Login;
