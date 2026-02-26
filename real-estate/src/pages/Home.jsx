import React, { useState, useEffect } from "react";
import api from "../services/api";
import PropertyCard from "../components/Property/PropertyCard";
import Hero from "../components/hero";
import Ads from "../components/Ads";
const Home = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        city: "",
        property_type: "",
        transaction_type: "",
        min_price: "",
        max_price: "",
    });
    const [appliedFilters, setAppliedFilters] = useState({});

    // Load properties on initial render and when appliedFilters change
    useEffect(() => {
        loadProperties();
    }, [appliedFilters]);

    const loadProperties = async () => {
        setLoading(true);
        try {
            const response = await api.getProperties({
                ...appliedFilters,
                status: "approved", // Only show approved properties to public
            });

            if (response.success) {
                setProperties(response.data);
            }
        } catch (error) {
            console.error("Failed to load properties:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    const applyFilters = () => {
        setAppliedFilters(filters);
    };

    const clearFilters = () => {
        const emptyFilters = {
            city: "",
            property_type: "",
            transaction_type: "",
            min_price: "",
            max_price: "",
        };
        setFilters(emptyFilters);
        setAppliedFilters(emptyFilters);
    };

    if (loading && properties.length === 0) {
        return (
            <div className="container mt-4">
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <Hero filters={filters} onFilterChange={handleFilterChange} onApplyFilters={applyFilters} onClearFilters={clearFilters} />
            <Ads />
            <div className="properties-section">
                <div className="properties-title-container">
                    <h2 className="properties-title">Available Properties</h2>
                </div>
                <div className="container mt-4">
                    <div>
                        <div>
                            <div className="row">
                                {properties.length === 0 ? (
                                    <div className="col-12">
                                        <div className="alert alert-info text-center">
                                            <h5>No properties found</h5>
                                            <p className="mb-0">
                                                {Object.values(appliedFilters).some((value) => value !== "")
                                                    ? "No properties match your current filters. Try adjusting your criteria."
                                                    : "No properties are currently available. Please check back later."}
                                            </p>
                                            {Object.values(appliedFilters).some((value) => value !== "") && (
                                                <button className="btn btn-outline-primary btn-sm mt-2" onClick={clearFilters}>
                                                    Clear All Filters
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    properties.map((property) => (
                                        <div key={property._id} className="col-lg-4 col-md-6 mb-4">
                                            <PropertyCard property={property} />
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
