import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PropertyDetails from "./pages/PropertyDetails";
import AdminDashboard from "./pages/AdminDashboard";
import SellerDashboard from "./pages/SellerDashboard";
import BuyerDashboard from "./pages/BuyerDashboard";
import AddProperty from "./pages/AddProperty";
import { PropertyProvider } from "./context/PropertyContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import AdminInquiries from "./pages/AdminInquiries";
import Team from "./pages/Team";

import "./App.css";

const ProtectedRoute = ({ children, requiredRole }) => {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to="/" />;
    }

    return children;
};

const PublicRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return <Navigate to="/" />;
    }

    return children;
};

function AppRoutes() {
    const { user } = useAuth();

    return (
        <div className="App">
            <Navbar />
            <main className="container-fluid p-0">
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/property/:id" element={<PropertyDetails />} />
                    <Route path="/team" element={<Team />} />

                    {/* Auth Routes */}
                    <Route
                        path="/login"
                        element={
                            <PublicRoute>
                                <Login />
                            </PublicRoute>
                        }
                    />
                    <Route
                        path="/register"
                        element={
                            <PublicRoute>
                                <Register />
                            </PublicRoute>
                        }
                    />

                    {/* Protected Routes */}
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute requiredRole="admin">
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/seller"
                        element={
                            <ProtectedRoute requiredRole="seller">
                                <SellerDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/buyer"
                        element={
                            <ProtectedRoute requiredRole="buyer">
                                <BuyerDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/add-property"
                        element={
                            <ProtectedRoute requiredRole="seller">
                                <AddProperty />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin-inquiries"
                        element={
                            <ProtectedRoute requiredRole="admin">
                                <AdminInquiries />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </main>
            <Footer />
        </div>
    );
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <FavoritesProvider>
                    <PropertyProvider>
                        <AppRoutes />
                    </PropertyProvider>
                </FavoritesProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
