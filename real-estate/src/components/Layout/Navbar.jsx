import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useFavorites } from "../../context/FavoritesContext";
import api from "../../services/api";
import logo from '../../../public/logo.png'
import '../../components/style/Header.css'
const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [showDropdown, setShowDropdown] = useState(false);
    const { favorites } = useFavorites();
    const [inquiryCount, setInquiryCount] = useState(0);

    useEffect(() => {
        if (user?.role === "seller") {
            loadInquiryCount();
        }
    }, [user]);

    const loadInquiryCount = async () => {
        try {
            const response = await api.getSellerInquiries();
            if (response.success) {
                const pendingInquiries = response.data.filter((inq) => inq.status === "pending");
                setInquiryCount(pendingInquiries.length);
            }
        } catch (error) {
            console.error("Error loading inquiry count:", error);
        }
    };

    const handleLogout = () => {
        logout();
        setShowDropdown(false);
    };

    const getDashboardLink = () => {
        if (!user) return null;

        switch (user.role) {
            case "admin":
                return (
                    <>
                        <Link className={`nav-link ${location.pathname === "/admin" ? "active" : ""}`} to="/admin">
                            Admin Dashboard
                        </Link>
                        <Link className={`nav-link ${location.pathname === "/admin-inquiries" ? "active" : ""}`} to="/admin-inquiries">
                            Admin Inquiries
                        </Link>
                    </>
                );

            case "seller":
                return (
                    <Link className={`nav-link ${location.pathname === "/seller" ? "active" : ""}`} to="/seller">
                        Seller Dashboard
                    </Link>
                );
            case "buyer":
                return (
                    <Link className={`nav-link ${location.pathname === "/buyer" ? "active" : ""}`} to="/buyer">
                        Buyer Dashboard
                    </Link>
                );
            default:
                return null;
        }
    };

    return (
        <nav className="navbar navbar-expand-lg ">
            <div className="container">
                <img className="logo-img" src={logo}/>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <div className="navbar-nav ms-auto">
                        <Link className={`nav-link ${location.pathname === "/" ? "active" : ""}`} to="/">
                            Browse Properties
                        </Link>

                        {isAuthenticated ? (
                            <>
                                {getDashboardLink()}

                                {user.role === "seller" && (
                                    <Link className={`nav-link ${location.pathname === "/add-property" ? "active" : ""}`} to="/add-property">
                                        Add Property
                                    </Link>
                                )}

                                <div className="nav-item dropdown">
                                    <a
                                        className="nav-link dropdown-toggle"
                                        href="#"
                                        role="button"
                                        data-bs-toggle="dropdown"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setShowDropdown(!showDropdown);
                                        }}
                                    >
                                        👤 {user.profile?.first_name} ({user.role})
                                    </a>
                                    <ul className={`dropdown-menu ${showDropdown ? "show" : ""}`}>
                                        <li>
                                            <button className="dropdown-item text-danger" onClick={handleLogout}>
                                                🚪 Logout
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link className={`nav-link ${location.pathname === "/login" ? "active" : ""}`} to="/login">
                                    Login
                                </Link>
                                <Link className={`nav-link ${location.pathname === "/register" ? "active" : ""}`} to="/register">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
