// Enhanced mock database with more users and properties
let mockUsers = [
    {
        _id: "507f1f77bcf86cd799439011",
        email: "admin@realestate.com",
        password: "admin123",
        role: "admin",
        profile: {
            first_name: "John",
            last_name: "Admin",
            phone_number: "+1234567890",
            avatar_url: "https://example.com/avatars/admin.jpg",
        },
        is_verified: true,
        created_at: new Date("2023-01-15"),
    },
    {
        _id: "507f1f77bcf86cd799439012",
        email: "seller1@example.com",
        password: "seller123",
        role: "seller",
        profile: {
            first_name: "Alice",
            last_name: "Johnson",
            phone_number: "+1234567891",
            avatar_url: "https://example.com/avatars/seller1.jpg",
        },
        is_verified: true,
        created_at: new Date("2023-02-20"),
    },
    {
        _id: "507f1f77bcf86cd799439013",
        email: "buyer1@example.com",
        password: "buyer123",
        role: "buyer",
        profile: {
            first_name: "Bob",
            last_name: "Smith",
            phone_number: "+1234567892",
            avatar_url: "https://example.com/avatars/buyer1.jpg",
        },
        is_verified: true,
        created_at: new Date("2023-03-10"),
    },
    {
        _id: "507f1f77bcf86cd799439014",
        email: "seller2@example.com",
        password: "seller123",
        role: "seller",
        profile: {
            first_name: "Sarah",
            last_name: "Williams",
            phone_number: "+1234567893",
            avatar_url: "https://example.com/avatars/seller2.jpg",
        },
        is_verified: true,
        created_at: new Date("2023-04-05"),
    },
    {
        _id: "507f1f77bcf86cd799439015",
        email: "buyer2@example.com",
        password: "buyer123",
        role: "buyer",
        profile: {
            first_name: "Mike",
            last_name: "Davis",
            phone_number: "+1234567894",
            avatar_url: "https://example.com/avatars/buyer2.jpg",
        },
        is_verified: true,
        created_at: new Date("2023-05-12"),
    },
    {
        _id: "507f1f77bcf86cd799439016",
        email: "seller3@example.com",
        password: "seller123",
        role: "seller",
        profile: {
            first_name: "Emma",
            last_name: "Brown",
            phone_number: "+1234567895",
            avatar_url: "https://example.com/avatars/seller3.jpg",
        },
        is_verified: true,
        created_at: new Date("2023-06-18"),
    },
    {
        _id: "507f1f77bcf86cd799439017",
        email: "buyer3@example.com",
        password: "buyer123",
        role: "buyer",
        profile: {
            first_name: "David",
            last_name: "Wilson",
            phone_number: "+1234567896",
            avatar_url: "https://example.com/avatars/buyer3.jpg",
        },
        is_verified: true,
        created_at: new Date("2023-07-22"),
    },
];

let mockProperties = [
    {
        _id: "607f1f77bcf86cd799439021",
        title: "Beautiful Modern Apartment in Downtown",
        description:
            "Spacious 3-bedroom apartment with stunning city views. Recently renovated with high-end finishes, hardwood floors, and modern appliances. Perfect for professionals or small families.",
        property_type: "apartment",
        transaction_type: "sale",
        price: 750000,
        currency: "USD",
        status: "approved",
        address: {
            street: "123 Main Street",
            city: "New York",
            state: "NY",
            zip_code: "10001",
            country: "USA",
            coordinates: {
                type: "Point",
                coordinates: [-74.0059, 40.7128],
            },
        },
        details: {
            bedrooms: 3,
            bathrooms: 2,
            area_sqft: 1800,
            year_built: 2015,
            lot_size: null,
            parking_spaces: 1,
            has_garage: true,
        },
        features: ["balcony", "city_view", "hardwood_floors", "elevator"],
        amenities: ["air_conditioning", "heating", "dishwasher", "washer_dryer"],
        images: [
            {
                _id: "707f1f77bcf86cd799439031",
                url: "https://example.com/properties/apt1-1.jpg",
                caption: "Living room",
                is_primary: true,
                order: 1,
                created_at: new Date(),
            },
        ],
        seller_id: "507f1f77bcf86cd799439012",
        approved_by: "507f1f77bcf86cd799439011",
        approved_at: new Date("2023-08-01"),
        created_at: new Date("2023-07-25"),
        updated_at: new Date("2023-08-01"),
    },
    {
        _id: "607f1f77bcf86cd799439022",
        title: "Cozy 2-Bedroom House for Rent",
        description: "Charming house in quiet neighborhood. Features a beautiful garden, updated kitchen, and comfortable living spaces. Perfect for small families or couples.",
        property_type: "house",
        transaction_type: "rent",
        price: 2500,
        currency: "USD",
        status: "pending",
        address: {
            street: "456 Oak Avenue",
            city: "Brooklyn",
            state: "NY",
            zip_code: "11201",
            country: "USA",
            coordinates: {
                type: "Point",
                coordinates: [-73.9442, 40.6782],
            },
        },
        details: {
            bedrooms: 2,
            bathrooms: 1,
            area_sqft: 1200,
            year_built: 1990,
            lot_size: 2500,
            parking_spaces: 2,
            has_garage: false,
        },
        features: ["garden", "patio", "fireplace"],
        amenities: ["heating", "parking"],
        images: [
            {
                _id: "707f1f77bcf86cd799439032",
                url: "https://example.com/properties/house1-1.jpg",
                caption: "Front view",
                is_primary: true,
                order: 1,
                created_at: new Date(),
            },
        ],
        seller_id: "507f1f77bcf86cd799439012",
        approved_by: null,
        approved_at: null,
        created_at: new Date("2023-08-10"),
        updated_at: new Date("2023-08-10"),
    },
    {
        _id: "607f1f77bcf86cd799439023",
        title: "Luxury Waterfront Villa",
        description: "Stunning villa with private beach access and panoramic ocean views. Features high ceilings, gourmet kitchen, infinity pool, and smart home technology.",
        property_type: "villa",
        transaction_type: "sale",
        price: 2500000,
        currency: "USD",
        status: "approved",
        address: {
            street: "789 Beach Road",
            city: "Miami",
            state: "FL",
            zip_code: "33139",
            country: "USA",
            coordinates: {
                type: "Point",
                coordinates: [-80.13, 25.7907],
            },
        },
        details: {
            bedrooms: 5,
            bathrooms: 4,
            area_sqft: 4500,
            year_built: 2018,
            lot_size: 10000,
            parking_spaces: 4,
            has_garage: true,
        },
        features: ["swimming_pool", "garden", "private_beach", "security_system"],
        amenities: ["air_conditioning", "heating", "smart_home", "jacuzzi"],
        images: [
            {
                _id: "707f1f77bcf86cd799439033",
                url: "https://example.com/properties/villa1-1.jpg",
                caption: "Exterior",
                is_primary: true,
                order: 1,
                created_at: new Date(),
            },
        ],
        seller_id: "507f1f77bcf86cd799439014",
        approved_by: "507f1f77bcf86cd799439011",
        approved_at: new Date("2023-07-28"),
        created_at: new Date("2023-07-20"),
        updated_at: new Date("2023-07-28"),
    },
    {
        _id: "607f1f77bcf86cd799439024",
        title: "Modern Downtown Condo",
        description: "Bright and spacious condo in the heart of downtown. Features floor-to-ceiling windows, modern kitchen, and building amenities including gym and rooftop terrace.",
        property_type: "condo",
        transaction_type: "sale",
        price: 450000,
        currency: "USD",
        status: "approved",
        address: {
            street: "321 City Center Blvd",
            city: "Chicago",
            state: "IL",
            zip_code: "60601",
            country: "USA",
            coordinates: {
                type: "Point",
                coordinates: [-87.6298, 41.8781],
            },
        },
        details: {
            bedrooms: 2,
            bathrooms: 2,
            area_sqft: 1100,
            year_built: 2020,
            lot_size: null,
            parking_spaces: 1,
            has_garage: true,
        },
        features: ["city_view", "hardwood_floors", "balcony"],
        amenities: ["gym", "pool", "concierge", "air_conditioning"],
        images: [
            {
                _id: "707f1f77bcf86cd799439034",
                url: "https://example.com/properties/condo1-1.jpg",
                caption: "Living area",
                is_primary: true,
                order: 1,
                created_at: new Date(),
            },
        ],
        seller_id: "507f1f77bcf86cd799439014",
        approved_by: "507f1f77bcf86cd799439011",
        approved_at: new Date("2023-08-05"),
        created_at: new Date("2023-07-30"),
        updated_at: new Date("2023-08-05"),
    },
    {
        _id: "607f1f77bcf86cd799439025",
        title: "Family Home with Large Yard",
        description: "Perfect family home in excellent school district. Features updated kitchen, finished basement, and large backyard with deck. Close to parks and shopping.",
        property_type: "house",
        transaction_type: "sale",
        price: 550000,
        currency: "USD",
        status: "pending",
        address: {
            street: "654 Maple Street",
            city: "Austin",
            state: "TX",
            zip_code: "78701",
            country: "USA",
            coordinates: {
                type: "Point",
                coordinates: [-97.7431, 30.2672],
            },
        },
        details: {
            bedrooms: 4,
            bathrooms: 3,
            area_sqft: 2200,
            year_built: 2005,
            lot_size: 8000,
            parking_spaces: 3,
            has_garage: true,
        },
        features: ["garden", "deck", "finished_basement"],
        amenities: ["air_conditioning", "heating", "dishwasher"],
        images: [
            {
                _id: "707f1f77bcf86cd799439035",
                url: "https://example.com/properties/house2-1.jpg",
                caption: "Front exterior",
                is_primary: true,
                order: 1,
                created_at: new Date(),
            },
        ],
        seller_id: "507f1f77bcf86cd799439016",
        approved_by: null,
        approved_at: null,
        created_at: new Date("2023-08-12"),
        updated_at: new Date("2023-08-12"),
    },
    {
        _id: "607f1f77bcf86cd799439026",
        title: "Studio Apartment near University",
        description: "Compact and efficient studio apartment perfect for students or young professionals. Recently updated with new appliances and flooring.",
        property_type: "apartment",
        transaction_type: "rent",
        price: 1200,
        currency: "USD",
        status: "approved",
        address: {
            street: "987 College Avenue",
            city: "Boston",
            state: "MA",
            zip_code: "02115",
            country: "USA",
            coordinates: {
                type: "Point",
                coordinates: [-71.0589, 42.3601],
            },
        },
        details: {
            bedrooms: 1,
            bathrooms: 1,
            area_sqft: 600,
            year_built: 2010,
            lot_size: null,
            parking_spaces: 0,
            has_garage: false,
        },
        features: ["hardwood_floors", "updated_kitchen"],
        amenities: ["laundry_room", "air_conditioning"],
        images: [
            {
                _id: "707f1f77bcf86cd799439036",
                url: "https://example.com/properties/studio1-1.jpg",
                caption: "Main living area",
                is_primary: true,
                order: 1,
                created_at: new Date(),
            },
        ],
        seller_id: "507f1f77bcf86cd799439016",
        approved_by: "507f1f77bcf86cd799439011",
        approved_at: new Date("2023-08-08"),
        created_at: new Date("2023-08-01"),
        updated_at: new Date("2023-08-08"),
    },
    {
        _id: "607f1f77bcf86cd799439027",
        title: "Luxury Penthouse with Terrace",
        description: "Exceptional penthouse offering breathtaking city views from private terrace. Features high-end finishes, gourmet kitchen, and premium building amenities.",
        property_type: "apartment",
        transaction_type: "sale",
        price: 1850000,
        currency: "USD",
        status: "rejected",
        address: {
            street: "555 Skyline Drive",
            city: "Los Angeles",
            state: "CA",
            zip_code: "90001",
            country: "USA",
            coordinates: {
                type: "Point",
                coordinates: [-118.2437, 34.0522],
            },
        },
        details: {
            bedrooms: 3,
            bathrooms: 3,
            area_sqft: 2800,
            year_built: 2019,
            lot_size: null,
            parking_spaces: 2,
            has_garage: true,
        },
        features: ["terrace", "city_view", "high_ceilings"],
        amenities: ["concierge", "gym", "pool", "valet"],
        images: [
            {
                _id: "707f1f77bcf86cd799439037",
                url: "https://example.com/properties/penthouse1-1.jpg",
                caption: "Living room and terrace",
                is_primary: true,
                order: 1,
                created_at: new Date(),
            },
        ],
        seller_id: "507f1f77bcf86cd799439012",
        approved_by: "507f1f77bcf86cd799439011",
        approved_at: null,
        created_at: new Date("2023-07-15"),
        updated_at: new Date("2023-07-20"),
    },
];

// Rest of the mockAPI code remains the same...
export const mockAuthAPI = {
    login: (email, password) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const user = mockUsers.find((u) => u.email === email && u.password === password);
                if (user) {
                    const { password: _, ...userWithoutPassword } = user;
                    resolve({
                        success: true,
                        user: userWithoutPassword,
                        token: "mock-jwt-token",
                    });
                } else {
                    resolve({ success: false, error: "Invalid credentials" });
                }
            }, 1000);
        });
    },

    register: (userData) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const existingUser = mockUsers.find((u) => u.email === userData.email);
                if (existingUser) {
                    resolve({ success: false, error: "User already exists" });
                } else {
                    const newUser = {
                        _id: Date.now().toString(),
                        ...userData,
                        is_verified: true,
                    };
                    mockUsers.push(newUser);
                    resolve({ success: true });
                }
            }, 1000);
        });
    },
};

// Rest of the property API functions remain the same...
export const mockPropertyAPI = {
    getProperties: (filters = {}) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                let filteredProperties = [...mockProperties];

                // Apply filters
                if (filters.status) {
                    filteredProperties = filteredProperties.filter((p) => p.status === filters.status);
                }
                if (filters.seller_id) {
                    filteredProperties = filteredProperties.filter((p) => p.seller_id === filters.seller_id);
                }
                if (filters.city) {
                    filteredProperties = filteredProperties.filter((p) => p.address.city.toLowerCase().includes(filters.city.toLowerCase()));
                }
                if (filters.property_type) {
                    filteredProperties = filteredProperties.filter((p) => p.property_type === filters.property_type);
                }
                if (filters.transaction_type) {
                    filteredProperties = filteredProperties.filter((p) => p.transaction_type === filters.transaction_type);
                }

                resolve({ success: true, data: filteredProperties });
            }, 500);
        });
    },

    getPropertyById: (propertyId) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const property = mockProperties.find((p) => p._id === propertyId || p._id?.$oid === propertyId);
                if (property) {
                    resolve({ success: true, data: property });
                } else {
                    resolve({ success: false, error: "Property not found" });
                }
            }, 500);
        });
    },

    createInquiry: (inquiryData) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newInquiry = {
                    _id: { $oid: Date.now().toString() },
                    ...inquiryData,
                    created_at: { $date: new Date().toISOString() },
                    updated_at: { $date: new Date().toISOString() },
                };
                // In a real app, this would be saved to the database
                console.log("Inquiry created:", newInquiry);
                resolve({ success: true, data: newInquiry });
            }, 500);
        });
    },

    addToFavorites: (userId, propertyId) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const favorite = {
                    _id: { $oid: Date.now().toString() },
                    user_id: { $oid: userId },
                    property_id: { $oid: propertyId },
                    created_at: { $date: new Date().toISOString() },
                };
                console.log("Added to favorites:", favorite);
                resolve({ success: true, data: favorite });
            }, 500);
        });
    },

    createProperty: (propertyData) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newProperty = {
                    _id: Date.now().toString(),
                    ...propertyData,
                    status: "pending",
                    created_at: new Date(),
                };
                mockProperties.push(newProperty);
                resolve({ success: true, data: newProperty });
            }, 1000);
        });
    },

    updatePropertyStatus: (propertyId, status, adminId) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const property = mockProperties.find((p) => p._id === propertyId);
                if (property) {
                    property.status = status;
                    property.approved_by = status === "approved" ? adminId : null;
                    property.updated_at = new Date();
                    resolve({ success: true, data: property });
                } else {
                    resolve({ success: false, error: "Property not found" });
                }
            }, 500);
        });
    },
};
