import React from "react";
import Navbar from "../components/navbar/Navbar";
import AdminSidebar from "../components/sidebar/AdminSidebar";
import { Outlet } from "react-router-dom";

function AdminLayout() {
  return (
    <div className="layout">
      <AdminSidebar />

      <div className="main-content">
        <Navbar />
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;