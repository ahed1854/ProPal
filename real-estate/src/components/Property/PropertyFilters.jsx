import React from "react";

const PropertyFilters = ({ filters, onFilterChange, onApplyFilters, onClearFilters }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        onFilterChange({
            ...filters,
            [name]: value,
        });
    };

    const clearFilters = () => {
        onClearFilters();
    };

    const hasActiveFilters = Object.values(filters).some((value) => value !== "");

    return (
        <div className="card">
            {/* <div className="card-header">
                <h5 className="mb-0">Filters</h5>
            </div> */}
            <div className="card-body1">
                <div className="mb-3">
                    <label className="form-label">City</label>
                    <input type="text" className="form-control" name="city" value={filters.city} onChange={handleChange} placeholder="Enter city..." />
                </div>

                <div className="mb-3">
                    <label className="form-label">Property Type</label>
                    <select className="form-control" name="property_type" value={filters.property_type} onChange={handleChange}>
                        <option value="">All Types</option>
                        <option value="apartment">Apartment</option>
                        <option value="house">House</option>
                        <option value="condo">Condo</option>
                        <option value="villa">Villa</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label">Transaction Type</label>
                    <select className="form-control" name="transaction_type" value={filters.transaction_type} onChange={handleChange}>
                        <option value="">All</option>
                        <option value="sale">For Sale</option>
                        <option value="rent">For Rent</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label">Min Price</label>
                    <input type="number" className="form-control" name="min_price" value={filters.min_price} onChange={handleChange} placeholder="0" />
                </div>

                <div className="mb-3">
                    <label className="form-label">Max Price</label>
                    <input type="number" className="form-control" name="max_price" value={filters.max_price} onChange={handleChange} placeholder="Any" />
                </div>
              
                </div>

                {/* Active Filters Summary */}
                {hasActiveFilters && (
                    <div className="mt-3 p-2 bg-light rounded">
                        <small className="text-muted d-block">Selected filters:</small>
                        {filters.city && <span className="badge bg-primary me-1 mb-1">City: {filters.city}</span>}
                        {filters.property_type && <span className="badge bg-primary me-1 mb-1">Type: {filters.property_type}</span>}
                        {filters.transaction_type && <span className="badge bg-primary me-1 mb-1">{filters.transaction_type === "sale" ? "For Sale" : "For Rent"}</span>}
                        {filters.min_price && <span className="badge bg-primary me-1 mb-1">Min: ${filters.min_price}</span>}
                        {filters.max_price && <span className="badge bg-primary me-1 mb-1">Max: ${filters.max_price}</span>}
                    </div>
                )}
            <div className=" button ">
                    <button className="btn btn-primary" onClick={onApplyFilters} disabled={!hasActiveFilters}>
                        Apply Filters
                    </button>
                    <button className="btn btn-outline-secondary" onClick={clearFilters} disabled={!hasActiveFilters}>
                        Clear Filters
                    </button>
                </div>
        </div>
    );
};

export default PropertyFilters;
