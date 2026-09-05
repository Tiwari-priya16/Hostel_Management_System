# 🏨 Hostel Management System (HostelSync)

A production-ready, full-stack **Hostel Management System** built using the **MERN Stack** (MongoDB, Express.js, React, Node.js) with Vite. HostelSync streamlines hostel administration, automates facility reservations, and enhances communication between Students, Wardens, and Super Administrators.

The application features a **3-Tier Role Hierarchy**, secure JWT authentication, real-time OTP email verification, Cloudinary cloud image storage, background automation, and a WhatsApp-style Community Hub.

---

## 🚀 Features

### 👨‍🎓 Student
- **Secure Authentication & OTP Reset:** Login, Register with hostel block assignment, and reset password via 6-digit email OTP.
- **Personal Profile:** Customize profile details and upload/change/remove profile photo (Cloudinary integration).
- **Complaints Management:** Raise complaints with optional evidence photos (Gallery/Camera) and view resolution proof photos.
- **Gate Pass (Entry / Exit):** One-tap hostel exit/entry logging with reason tracking (College, Home, Market, Medical, Other) and timestamping.
- **Smart Laundry Reservation:** Reserve washing machine time slots (7:00 AM – 11:00 PM), view live machine statuses (`FREE`, `BOOKED`, `IN_USE`, `UNDER_SERVICE`), and report broken machines.
- **Mess Menu & Meal Ratings:** View 7-day master menu, check real-time mess status, and rate daily meals on Food Quality, Cleanliness, and Taste.
- **WhatsApp-Style Community Hub:** Participate in General Chat, Lost & Found Desk (with `LOST`/`FOUND` tags & photos), read Official Announcements, and chat in private Block Community groups.
- **Leave & Room Transfers:** Apply for outstation leaves and request room transfers.

### 🪪 Warden / Caretaker / Staff
- **Warden Operations Dashboard:** Real-time metrics for active complaints, pending leaves, students currently outside past curfew, and laundry maintenance.
- **Leave Pass Approvals:** Review, Approve, or Reject student leave requests.
- **Gate & Curfew Tracking:** Monitor live list of students currently outside the hostel and inspect gate logs.
- **Complaint Resolution:** Change complaint statuses (`Pending` ➔ `In Progress` ➔ `Resolved`) and upload "Proof of Fix" resolution photos.
- **Laundry Care:** Resolve student machine reports and toggle machines between `UNDER_SERVICE` and `FREE`.
- **Community Announcements:** Publish, pin, and delete official hostel announcements.

### 👑 Super Admin
- **Full System Control:** Access executive dashboard with master occupancy, user statistics, and system analytics.
- **User Roster Management:** View, manage, and inspect all Student, Warden, and Staff accounts.
- **Master Mess Menu Editor:** Update and customize the 7-day weekly master mess menu.
- **Laundry Rules Configuration:** Customize hostel laundry operating hours, max advance booking days, and no-show grace periods.
- **Room Transfer Approvals:** Review and approve room transfer requests.

---

## 🛠 Tech Stack

### Frontend
- **React.js (v19)** – Declarative Component-Based UI
- **Vite (v7)** – Ultra-Fast Build Tool & Dev Server
- **React Router DOM (v7)** – Client-Side Routing & Protected Routes
- **React Toastify** – Modern Toast Notifications
- **React Icons (FontAwesome)** – UI & Navigation Icons
- **Custom CSS Variables** – Light & Dark Theme Support

### Backend
- **Node.js & Express.js** – RESTful API Server
- **MongoDB & Mongoose** – NoSQL Database & Data Modeling
- **JWT (JSON Web Tokens)** – Stateless Authentication
- **bcrypt.js** – Password Hashing
- **Nodemailer** – Real SMTP Email OTP Delivery
- **Cloudinary SDK & Multer** – Cloud Image Storage & Stream Processing
- **Express Validator** – Request Validation Middleware

---

## 📂 Project Structure

```
hostel-management-system/
│
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # API request handlers (Auth, Complaint, Gate, Laundry, Mess, Community)
│   ├── middleware/      # Auth, Role Authorization, Multer Upload, and Validation
│   ├── models/          # Mongoose Schemas (User, Complaint, GatePass, WashingMachine, etc.)
│   ├── routes/          # Express API Endpoints
│   ├── utils/           # Helpers (Cloudinary, Email OTP, Notifications, Laundry Auto-Job)
│   ├── validators/      # Express Validator Rules
│   ├── server.js        # Main Express App & Background Jobs
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── assets/      # Logos & Static Assets
│   │   ├── components/  # Reusable UI (Navbar, Sidebar, ProtectedRoute)
│   │   ├── context/     # ThemeContext (Light/Dark Mode)
│   │   ├── pages/       # Admin, Student, Auth, Gate, Laundry, Mess, Community Pages
│   │   ├── services/    # Axios API Service Modules
│   │   ├── App.jsx      # App Routing & Toast Container
│   │   └── global.css   # Theme Variables & Global Styles
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

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

---

### 3. Install Frontend Dependencies

Open another terminal window:

```bash
cd frontend
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file inside the **`backend`** directory and configure the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key

# Email Service (Nodemailer OTP)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_digit_app_password

# Cloudinary Cloud Storage
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
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

## 📌 Modules

- **3-Tier Role Hierarchy & Authentication**
- **Student Profile & Cloudinary Photo Management**
- **Complaint Management with Evidence & Proof of Fix Photos**
- **Smart Washing Machine Reservation & Automation Engine**
- **Student Gate Pass & Entry/Exit Curfew Tracking**
- **Mess Menu & Integrated Meal Quality Ratings**
- **WhatsApp-Style Community Hub (General, Announcements, Lost & Found, Block Chat)**
- **Leave Pass Management**
- **Visitor Entry Registration & Approvals**
- **Room Transfer Requests**
- **Real-Time Notification System**
- **Light / Dark Mode Theme System**

---

## 🔒 Authentication & Security

- **JSON Web Tokens (JWT):** Secure session management stored in client `localStorage`.
- **Bcrypt Hashing:** Passwords hashed with 10 salt rounds before database persistence.
- **Protected Routes (`<ProtectedRoute>`):** Client-side navigation guards for authenticated routes.
- **Role-Based Access Control (RBAC):** Backend endpoint authorization matching `student`, `warden`/`staff`, and `admin` roles.
- **Client & Backend Image Validation:** Strict 2MB file limit and MIME type filtering (JPG, JPEG, PNG).

---

## 📦 Backend Dependencies

- `express`
- `mongoose`
- `jsonwebtoken`
- `bcryptjs`
- `nodemailer`
- `cloudinary`
- `multer`
- `dotenv`
- `cors`
- `express-validator`

---

## 📦 Frontend Dependencies

- `react` (v19)
- `react-dom`
- `react-router-dom` (v7)
- `vite`
- `axios`
- `react-toastify`
- `react-icons`

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License. Intended for educational and demonstration purposes.

---

## 👨‍💻 Developer

**Priya Tiwari**

- **GitHub:** [Tiwari-priya16](https://github.com/Tiwari-priya16/)

---

⭐ If you found this project useful, consider giving it a star on GitHub!
