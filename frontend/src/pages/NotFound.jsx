import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaExclamationTriangle } from "react-icons/fa";
import "./NotFound.css";

function NotFound() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const goHome = () => {
    if (!user) {
      navigate("/");
    } else if (user.role === "admin") {
      navigate("/dashboard/admin");
    } else if (user.role === "warden" || user.role === "staff") {
      navigate("/dashboard/staff");
    } else {
      navigate("/dashboard/student");
    }
  };

  return (
    <div className="notfound-container">
      <div className="notfound-card">
        <div className="notfound-icon">
          <FaExclamationTriangle />
        </div>
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
        <button className="home-btn" onClick={goHome}>
          <FaHome /> Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default NotFound;
