import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user) {
    return <Navigate to="/" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === "admin") return <Navigate to="/dashboard/admin" />;
    if (user.role === "warden" || user.role === "staff") return <Navigate to="/dashboard/staff" />;
    return <Navigate to="/dashboard/student" />;
  }

  return children;
}

export default ProtectedRoute;
