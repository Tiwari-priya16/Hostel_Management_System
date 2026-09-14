# 🏨 HostelSync - Smart Hostel Management System

A production-ready, full-stack **Hostel Management System** built using the **MERN Stack** (MongoDB, Express.js, React, Node.js) with Vite. HostelSync streamlines hostel administration, automates facility reservations, and enhances communication between Students, Wardens, and Super Administrators.

The application features a **3-Tier Role Hierarchy**, secure JWT authentication, real-time OTP email verification, Cloudinary cloud image storage, and a robust administrative approval workflow.

---

## 🌟 Standout Features

- **🔐 3-Tier Security Architecture:** Strict Role-Based Access Control (RBAC) ensuring data privacy. Students can't peek into admin data, and block admins are isolated to their specific hostel blocks.
- **🛡️ Administrative Gatekeeping:** New Warden/Staff registrations must be manually approved by a Super Admin before they can access the system.
- **📍 Multi-Block Isolation:** Wardens only see and manage students, complaints, and laundry for their assigned hostel block (Block A, B, C, or D).
- **📅 Policy-Driven Automation:** Smart logic for everything—from 30-day leave application windows to restricted meal feedback timings.
- **🛡️ Security Hardened:** Implementation of API Rate Limiting to prevent brute-force attacks and Bcrypt password hashing.

---

## 🚀 Features

### 👨‍🎓 Student
- **Secure Authentication:** Login, Register with hostel block assignment, and reset password via 6-digit email OTP.
- **Personal Profile:** Customize profile details, change passwords with current-password verification, and upload profile photos via Cloudinary.
- **Complaints Management:** Raise complaints with optional evidence photos (Gallery/Camera) and track resolution with proof photos.
- **Gate Pass (Entry / Exit):** Digital one-tap hostel exit/entry logging with reason tracking and real-time status updates.
- **Smart Laundry Reservation:** Reserve washing machine time slots using a custom modern date picker, view live machine statuses (`FREE`, `BOOKED`, `IN_USE`), and report maintenance issues.
- **Mess & Meal Ratings:** View 7-day master menu, check mess status, and rate meals *only after* the meal time has passed to ensure authentic feedback.
- **Community Hub:** Participate in General Chat, Block Community groups, and a curated Lost & Found Desk (with `LOST`/`FOUND` tags & photos).
- **Leave & Room Transfers:** Apply for outstation leaves (within a 30-day upcoming window) and request room transfers.

### 🪪 Warden / Caretaker / Staff
- **Localized Dashboard:** Real-time metrics filtered by assigned block—including active complaints, pending leaves, and students currently outside past curfew.
- **Administrative Approvals:** Review, Approve, or Reject student leave and room transfer requests for their specific block.
- **Gate Monitoring:** Monitor live list of students from their block who are currently outside the hostel.
- **Resolution Center:** Change complaint statuses and upload "Proof of Fix" resolution photos.
- **Laundry Care:** Resolve machine reports and manage machines within their assigned block.
- **Communication:** Publish, pin, and moderate community announcements. (Restricted from deleting Super Admin content).

### ⭐ Super Admin
- **Full System Control:** Access executive dashboard with master occupancy, global user statistics, and system-wide analytics.
- **Staff Approval Workflow:** Review and Approve or Reject new Warden/Staff account requests before they gain access.
- **User Roster Management:** View and manage all active Student, Warden, and Staff accounts across all blocks.
- **Master Data Editor:** Update the 7-day weekly mess menu and configure hostel-wide laundry operating rules.
- **Global Governance:** Oversee all room transfers, notices, and system configurations.

---

## 🛠 Tech Stack

### Frontend
- **React.js (v19)** – Declarative Component-Based UI
- **Vite (v7)** – Ultra-Fast Build Tool & Dev Server
- **React Router (v7)** – Client-Side Routing with strict RBAC protection.
- **Custom UI Components:** Integrated fading-dot loader, modern `react-datepicker`, and custom theme-aware confirmation modals.
- **Styling:** Custom CSS Variables with native **Light & Dark Theme** support.

### Backend
- **Node.js & Express.js** – RESTful API Server with global error handling.
- **MongoDB & Mongoose** – NoSQL Database & Data Modeling.
- **JWT & Bcrypt** – Secure stateless authentication and password hashing.
- **Nodemailer** – SMTP Email delivery for OTP verification.
- **Cloudinary & Multer** – Cloud image storage and stream processing.
- **Security:** `express-rate-limit` protection and request validation middleware.

---

## 📂 Project Structure

```
HostelSync/
│
├── backend/
│   ├── config/          # Database & Security configurations
│   ├── controllers/     # API request handlers (Auth, Complaint, Gate, Laundry, etc.)
│   ├── middleware/      # Auth, RBAC, Rate-Limit, and Validation logic
│   ├── models/          # Mongoose Schemas (User, Complaint, Notice, etc.)
│   ├── routes/          # Express API Endpoints structure
│   └── utils/           # Helpers (Cloudinary, Email OTP, Job Cleanups)
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI (Loader, ConfirmModal, CustomDatePicker)
│   │   ├── context/     # Theme & Global State Management
│   │   ├── pages/       # Role-specific dashboard and feature pages
│   │   ├── services/    # Axios API communication modules
│   │   └── global.css   # Dynamic theme variables
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Tiwari-priya16/Hostel_Management_System.git
cd Hostel_Management_System
```

---

### 2. Install Dependencies

```bash
# Install Backend Dependencies
cd backend
npm install

# Install Frontend Dependencies
cd ../frontend
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file inside the **`backend`** directory:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key

# Email Service (Nodemailer OTP)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Cloudinary Cloud Storage
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

---

## ▶️ Running the Project

### Start Backend Server

```bash
cd backend
npm run dev
```

---

### Start Frontend Client

```bash
cd frontend
npm run dev
```

- **Frontend Application:** `http://localhost:5173`
- **Backend API Server:** `http://localhost:5000`

---

## 📄 License & Contact

Developed by **Priya Tiwari** (GitHub: [Tiwari-priya16](https://github.com/Tiwari-priya16/)).

This project is licensed under the ISC License. Intended for educational and administrative demonstration purposes.

---

⭐ If you found this project useful, consider giving it a star on GitHub!
