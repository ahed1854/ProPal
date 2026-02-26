import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
});

// Request interceptor to add auth token and handle Content-Type
api.interceptors.request.use(
    (config) => {
        // Check local storage for token (adjust key if you use "realestate_token")
        const token = localStorage.getItem("token") || localStorage.getItem("realestate_token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // CRITICAL FIX FOR IMAGES:
        // If data is FormData (file upload), let browser set Content-Type (multipart/form-data)
        // If data is JSON, force application/json
        if (config.data instanceof FormData) {
            delete config.headers["Content-Type"];
        } else {
            config.headers["Content-Type"] = "application/json";
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for consistent error handling
api.interceptors.response.use(
    (response) => response.data, // Return only the data object
    (error) => {
        console.error("API call failed:", error.response?.data || error.message);
        // Return a standardized error object to prevent app crashes
        return Promise.reject(error.response?.data || { success: false, error: "Network or Server Error" });
    }
);

const apiService = {
    // --- AUTH ENDPOINTS ---
    login: (credentials) => api.post("/auth/login", credentials),
    register: (userData) => api.post("/auth/register", userData),
    getProfile: () => api.get("/users/profile"),

    // --- PROPERTY ENDPOINTS ---
    getProperties: (filters = {}) => api.get("/properties", { params: filters }),
    getPropertyById: (id) => api.get(`/properties/${id}`),

    // This handles the FormData automatically thanks to the interceptor above
    createProperty: (propertyData) => api.post("/properties", propertyData),

    updatePropertyStatus: (id, status) => api.patch(`/properties/${id}/status`, { status }),

    // --- FAVORITE ENDPOINTS ---
    // Combined toggle approach (preferred)
    toggleFavorite: (propertyId) => api.post("/favorites/toggle", { propertyId }),

    // Specific methods if your components use them
    addToFavorites: (propertyId) => api.post("/favorites", { property_id: propertyId }),
    removeFromFavorites: (propertyId) => api.delete(`/favorites/${propertyId}`),

    getFavorites: () => api.get("/favorites"),

    // Check if specific property is favored
    checkFavorite: (propertyId) => api.get(`/favorites/check/${propertyId}`),
    // Helper for context (returns boolean)
    isFavorited: (propertyId) => api.get(`/favorites/check/${propertyId}`),

    // --- INQUIRY ENDPOINTS ---
    createInquiry: (data) => api.post("/inquiries", data),

    // Get lists
    getMyInquiries: () => api.get("/inquiries/my-inquiries"),
    getSellerInquiries: () => api.get("/inquiries/seller-inquiries"),
    getAdminInquiries: () => api.get("/inquiries/admin-inquiries"),
    getInquiryById: (id) => api.get(`/inquiries/${id}`),

    // Update status (Consolidated method)
    // updateInquiryStatus: (id, status, note = "", responseMessage = "") => {
    //     const payload = { status };
    //     if (note) payload.note = note;
    //     if (responseMessage) {
    //         payload.response_message = responseMessage;
    //         payload.response_date = new Date();
    //     }
    //     return api.patch(`/inquiries/${id}/status`, payload);
    // },
    updateInquiryStatus: (id, status, note = "", responseMessage = "") => {
        const payload = { status };
        if (note) payload.note = note;
        if (responseMessage) {
            payload.response_message = responseMessage;
            payload.response_date = new Date();
        }
        return api.patch(`/inquiries/${id}/status`, payload);
    },

    sendInquiryResponse: (id, responseMessage, note = "") => {
        return api.patch(`/inquiries/${id}/respond`, {
            response_message: responseMessage,
            note: note,
        });
    },

    // Add specific note
    addInquiryNote: (id, note) => api.patch(`/inquiries/${id}/note`, { note }),
};

export default apiService;
