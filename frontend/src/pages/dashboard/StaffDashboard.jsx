import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";

import { getAllComplaints } from "../../services/complaintService";
import { getLeaveAnalytics } from "../../services/leaveService";
import { getGateAdminStats } from "../../services/gateService";
import { getMachines } from "../../services/laundryService";
import { getAllVisitors } from "../../services/visitorService";

import {
  FaClipboardList,
  FaCalendarAlt,
  FaWalking,
  FaTshirt,
  FaUsers,
  FaCheckCircle,
} from "react-icons/fa";

import "./dashboard.css";

function StaffDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [stats, setStats] = useState({
    pendingComplaints: 0,
    pendingLeaves: 0,
    studentsOutside: 0,
    activeLaundry: 0,
    pendingVisitors: 0,
  });

  const [urgentComplaints, setUrgentComplaints] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [
        complaintRes,
        leaveRes,
        gateRes,
        machineRes,
        visitorRes,
      ] = await Promise.all([
        getAllComplaints(),
        getLeaveAnalytics(),
        getGateAdminStats(),
        getMachines(),
        getAllVisitors(),
      ]);

      const complaintsList = complaintRes?.data?.complaints || [];
      const pendingComplaintsCount = complaintsList.filter(c => c.status === "Pending" || c.status === "In Progress").length;

      setStats({
        pendingComplaints: pendingComplaintsCount,
        pendingLeaves: leaveRes.data?.analytics?.pending || 0,
        studentsOutside: gateRes.stats?.totalOutside || 0,
        activeLaundry: machineRes.machines?.filter(m => m.status === "IN_USE" || m.status === "BOOKED").length || 0,
        pendingVisitors: visitorRes.visitors?.filter(v => v.status === "Pending").length || 0,
      });

      // Set urgent pending complaints for quick ground action
      setUrgentComplaints(complaintsList.filter(c => c.status === "Pending").slice(0, 5));
    } catch (error) {
      console.error("Warden Dashboard Fetch Error:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="content">
        <Navbar />

        <h1 className="welcome-text">
          Warden & Caretaker Operations
        </h1>

        {/* Operational Cards Grid */}
        <div className="cards">
          <div className="card" onClick={() => navigate("/admin/complaints")}>
            <div className="card-icon complaints-icon"><FaClipboardList /></div>
            <div className="card-info">
              <h3>Active Complaints</h3>
              <p>{stats.pendingComplaints}</p>
            </div>
          </div>

          <div className="card" onClick={() => navigate("/admin/leaves")}>
            <div className="card-icon leaves-icon"><FaCalendarAlt /></div>
            <div className="card-info">
              <h3>Pending Leaves</h3>
              <p>{stats.pendingLeaves}</p>
            </div>
          </div>

          <div className="card" onClick={() => navigate("/admin/gate")}>
            <div className="card-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}><FaWalking /></div>
            <div className="card-info">
              <h3>Students Outside</h3>
              <p>{stats.studentsOutside}</p>
            </div>
          </div>

          <div className="card" onClick={() => navigate("/admin/laundry")}>
            <div className="card-icon laundry-icon"><FaTshirt /></div>
            <div className="card-info">
              <h3>In Use Machines</h3>
              <p>{stats.activeLaundry}</p>
            </div>
          </div>

          <div className="card" onClick={() => navigate("/admin/visitors")}>
            <div className="card-icon visitors-icon"><FaUsers /></div>
            <div className="card-info">
              <h3>Pending Visitors</h3>
              <p>{stats.pendingVisitors}</p>
            </div>
          </div>
        </div>

        {/* Urgent Actions Section */}
        <div style={{ marginTop: "40px" }}>
          <h2 style={{ fontSize: "20px", color: "var(--text-primary)", marginBottom: "20px" }}>
            Urgent Ground Complaints Requiring Action
          </h2>

          <div className="complaint-list-container" style={{ marginTop: 0 }}>
            {urgentComplaints.length === 0 ? (
              <p style={{ margin: 0, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "8px" }}>
                <FaCheckCircle style={{ color: "#22c55e" }} /> All pending complaints are currently clear!
              </p>
            ) : (
              <table className="complaint-table">
                <thead>
                  <tr>
                    <th>Student & Room</th>
                    <th>Issue Title</th>
                    <th>Category</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {urgentComplaints.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <strong>{item.raisedBy?.name || "N/A"}</strong>
                        <br />
                        <small style={{ color: "var(--text-muted)" }}>
                          {item.raisedBy?.hostelBlock}-{item.roomNumber || item.raisedBy?.roomNumber || "N/A"}
                        </small>
                      </td>

                      <td>{item.title}</td>

                      <td>{item.category}</td>

                      <td>
                        <button
                          className="rate-btn"
                          style={{ padding: "6px 14px", fontSize: "13px" }}
                          onClick={() => navigate("/admin/complaints")}
                        >
                          Resolve Issue
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default StaffDashboard;
