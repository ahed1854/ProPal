# Propal

**Propal** is a full‑stack real estate platform that connects buyers, sellers, and administrators.  
Buyers can browse, rent, or purchase properties; sellers can list and manage their properties; and admins have full control over users, listings, and platform settings through a dedicated web dashboard.

The project consists of three main parts:

- **Backend API** – built with Node.js, Express, and MongoDB
- **Admin Web Panel** – a React single‑page application for administrators
- **Mobile App** – a React Native application for end‑users (buyers and sellers)

---

## ✨ Features

- **User roles:** Buyer, Seller, Admin
- **Property listings:** Create, read, update, delete (CRUD) with images and details
- **Search & filters:** Location, price range, property type, etc.
- **Authentication:** JWT‑based login/signup
- **Favorites / saved properties** (buyers)
- **In‑app messaging** between buyers and sellers (optional – to be implemented)
- **Admin dashboard:** Manage users, properties, and platform content
- **RESTful API** with MongoDB (Mongoose ODM)

---

## 🛠 Tech Stack

| Layer              | Technology                                |
| ------------------ | ----------------------------------------- |
| **Backend**        | Node.js, Express, MongoDB (Mongoose)      |
| **Web Admin**      | React, React Router, Axios, Tailwind CSS  |
| **Mobile App**     | React Native (Expo or CLI)                |
| **Authentication** | JSON Web Tokens (JWT), bcrypt             |
| **File Storage**   | Multer / Cloudinary (for property images) |
| **Environment**    | dotenv                                    |
