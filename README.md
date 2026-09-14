# 🏨 HostelSync - Smart Hostel Management System

A robust, enterprise-grade **Full-Stack MERN Application** designed to automate and simplify hostel administration. **HostelSync** provides a seamless interface for Students, Wardens, and Super Administrators to manage everything from complaints and laundry to gate passes and community interactions.

---

## 🌟 What Makes HostelSync Different?

- **🔐 3-Tier Security Architecture:** Strict Role-Based Access Control (RBAC) ensuring data privacy. Students can't peek into admin data, and block admins are isolated to their specific hostel blocks.
- **🛡️ Administrative Gatekeeping:** New Warden/Staff registrations must be manually approved by a Super Admin before they can access any sensitive data.
- **📍 Multi-Block Isolation:** Wardens only see and manage students, complaints, and laundry for their assigned hostel block, while Super Admins maintain a global "birds-eye" view.
- **📅 Policy-Driven Automation:** Smart logic for everything—from 30-day leave application windows to restricted meal feedback timings.

---

## 🚀 Key Modules & Features

### 👨‍🎓 Student Portal
- **Dashboard:** Real-time personal stats (Active bookings, Pending complaints, Pass status).
- **Laundry Hub:** Interactive date-picker for washing machine slot booking with live machine status (`FREE`, `BOOKED`, `IN_USE`).
- **Pass System:** Apply for Gate Passes and Leave Applications (enforced 30-day upcoming window policy).
- **Mess Management:** View 7-day master menu and provide meal ratings only *after* the meal time has passed.
- **Community Hub:** Participate in General Chat, Block-specific groups, and a curated Lost & Found desk.
- **Profile:** Self-service profile management with Cloudinary image uploads and secure password changing.

### 🪪 Warden & Staff Dashboard
- **Localized Operations:** Filtered view of complaints, leaves, and visitors belonging *only* to their assigned block.
- **Resolution Center:** Update complaint statuses and upload "Proof of Fix" photos.
- **Gate Monitoring:** Real-time tracker for students currently outside the hostel.
- **Broadcasting:** Create hostel-wide notices and pin important announcements in the community hub.

### 👑 Super Admin Executive Panel
- **Global Roster:** Manage all users, monitor overall occupancy, and inspect system-wide analytics.
- **Approval Workflow:** Approve or Reject new staff account requests.
- **System Config:** Define laundry operating hours, mess menus, and system-wide notice management.

---

## 🛠 Tech Stack

- **Frontend:** React.js (v19), Vite (v7), React Router (v7), React Toastify, React Icons.
- **Backend:** Node.js, Express.js, JWT, Bcrypt, Express Rate Limit.
- **Database:** MongoDB Atlas (NoSQL) with Mongoose ODM.
- **Storage:** Cloudinary SDK for professional cloud-based image hosting.
- **Notifications:** Custom internal notification engine + SMTP (Nodemailer) for OTPs.

---

## 📂 Project Roadmap (Directory Structure)

```
HostelSync/
├── backend/
│   ├── controllers/     # Business logic & Handlers
│   ├── middleware/      # Auth (JWT) & Security (RBAC/Rate-Limit)
│   ├── models/          # Data Schemas (Mongoose)
│   ├── routes/          # API Endpoints structure
│   └── utils/           # Helper scripts (Email, Cloudinary, Job Cleanups)
└── frontend/
    ├── src/
    │   ├── components/  # Reusable UI (Custom Loader, Modals, DatePicker)
    │   ├── pages/       # Role-specific dashboard & feature pages
    │   ├── services/    # API communication layer (Axios)
    │   └── context/     # Global state & Theme management
```

---

## ⚙️ Setup & Deployment

### 1. Local Development
1.  **Clone:** `git clone https://github.com/Tiwari-priya16/Hostel_Management_System.git`
2.  **Install:** Run `npm install` in both `backend` and `frontend` folders.
3.  **Env Setup:** Create a `.env` in the backend folder (refer to `.env.example`).
4.  **Run:** Start the backend with `npm run dev` and frontend with `npm run dev`.

### 2. Production Deployment
- **Backend:** Recommended to host on **Render** or **Railway**. Set environment variables for DB and Cloudinary.
- **Frontend:** Recommended for **Vercel** or **Netlify**. Ensure `VITE_API_URL` points to your deployed backend.

---

## 📄 License & Contact
Developed by **Priya Tiwari** (GitHub: [Tiwari-priya16](https://github.com/Tiwari-priya16/)).
This project is licensed under the ISC License. For inquiries or contributions, feel free to reach out!
