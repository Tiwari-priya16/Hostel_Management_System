# 🏨 Hostel Management System

A full-stack **Hostel Management System** built using the **MERN Stack** to simplify hostel administration and improve communication between students and hostel staff.

The system provides role-based access for administrators and students, allowing efficient management of complaints, leave requests, visitors, room transfers, laundry services, notices, and feedback.

---

## 🚀 Features

### 👨‍🎓 Student
- Secure Login & Authentication
- Submit Complaints
- Apply for Leave
- Request Room Transfer
- Register Visitors
- Laundry Requests
- View Notices
- Submit Feedback

### 👨‍💼 Admin
- Manage Students
- Approve/Reject Leave Requests
- Manage Complaints
- Manage Room Transfer Requests
- Manage Visitor Entries
- Manage Laundry Requests
- Post Hostel Notices
- View Student Feedback

---

## 🛠 Tech Stack

### Frontend
- React.js
- Vite
- React Router DOM
- Axios
- React Toastify
- React Icons

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt.js
- Express Validator

---

## 📂 Project Structure

```
hostel-management-system/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
(https://github.com/DeepakMaindola/Hostel-management-System.git)
```

```bash
cd hostel-management-system
```

---

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

---

### 3. Install Frontend Dependencies

Open another terminal.

```bash
cd frontend
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file inside the **backend** folder.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

## ▶️ Running the Project

### Start Backend

```bash
cd backend
npm run dev
```

---

### Start Frontend

```bash
cd frontend
npm run dev
```

Frontend will run on

```
http://localhost:5173
```

Backend will run on

```
http://localhost:5000
```

---

## 📌 Modules

- Authentication
- Complaint Management
- Leave Management
- Visitor Management
- Room Transfer Management
- Laundry Management
- Notice Board
- Feedback Management
- Role-Based Authorization

---

## 🔒 Authentication

The project uses:

- JWT (JSON Web Token)
- Password Hashing using bcrypt.js
- Protected Routes
- Role-Based Access Control

---

## 📦 Backend Dependencies

- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt.js
- dotenv
- cors
- express-validator

---

## 📦 Frontend Dependencies

- React
- Vite
- Axios
- React Router DOM
- React Toastify
- React Icons


---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a new branch

```bash
git checkout -b feature-name
```

3. Commit your changes

```bash
git commit -m "Added new feature"
```

4. Push to your branch

```bash
git push origin feature-name
```

5. Create a Pull Request

---

## 📄 License

This project is intended for educational purposes.

---

## 👨‍💻 Developer

**Deepak Brahman**

GitHub: https://github.com/DeepakMaindola/

---

⭐ If you found this project useful, consider giving it a star on GitHub.
