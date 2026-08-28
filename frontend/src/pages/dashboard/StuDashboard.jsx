import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { getMyComplaints } from "../../services/complaintService";
import { getMyLeaves } from "../../services/leaveService";
import { getMyLaundryBookings } from "../../services/laundryService";
import { getMyVisitors } from "../../services/visitorService";
import { getMyTransfers } from "../../services/roomTransferService";

import {
  FaClipboardList,
  FaCalendarAlt,
  FaTshirt,
  FaUsers,
  FaUtensils,
  FaExchangeAlt,
  FaWalking,
} from "react-icons/fa";

import "./dashboard.css";

function StuDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [stats, setStats] = useState({
    complaints: 0,
    leaves: 0,
    laundry: 0,
    visitors: 0,
    roomTransfer: 0,
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [
        complaintRes,
        leaveRes,
        laundryRes,
        visitorRes,
        transferRes,
      ] = await Promise.all([
        getMyComplaints(),
        getMyLeaves(),
        getMyLaundryBookings(),
        getMyVisitors(),
        getMyTransfers(),
      ]);

      setStats({
        complaints: complaintRes?.complaints?.length || complaintRes?.data?.complaints?.length || 0,
        leaves: leaveRes?.leaves?.length || leaveRes?.data?.leaves?.length || 0,
        laundry: laundryRes?.bookings?.length || 0,
        visitors: visitorRes?.visitors?.length || visitorRes?.data?.visitors?.length || 0,
        roomTransfer: transferRes?.transfers?.length || transferRes?.data?.transfers?.length || 0,
      });
    } catch (error) {
      console.log("Student Dashboard Fetch Error:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="content">
        <Navbar />
        <h1 className="welcome-text">Welcome, {user?.name}</h1>
        <div className="cards">
          <div className="card" onClick={() => navigate("/my-complaints")}>
            <div className="card-icon complaints-icon"><FaClipboardList /></div>
            <div className="card-info">
              <h3>Complaints</h3>
              <p>{stats.complaints}</p>
            </div>
          </div>

          <div className="card" onClick={() => navigate("/my-leaves")}>
            <div className="card-icon leaves-icon"><FaCalendarAlt /></div>
            <div className="card-info">
              <h3>Leave Requests</h3>
              <p>{stats.leaves}</p>
            </div>
          </div>

          <div className="card" onClick={() => navigate("/laundry/history")}>
            <div className="card-icon laundry-icon"><FaTshirt /></div>
            <div className="card-info">
              <h3>Laundry</h3>
              <p>{stats.laundry}</p>
            </div>
          </div>

          <div className="card" onClick={() => navigate("/visitors/history")}>
            <div className="card-icon visitors-icon"><FaUsers /></div>
            <div className="card-info">
              <h3>Visitors</h3>
              <p>{stats.visitors}</p>
            </div>
          </div>

          <div className="card" onClick={() => navigate("/mess")}>
            <div className="card-icon feedback-icon"><FaUtensils /></div>
            <div className="card-info">
              <h3>Mess & Feedback</h3>
              <p className="card-value-small">Menu</p>
            </div>
          </div>

          <div className="card" onClick={() => navigate("/room-transfer/history")}>
            <div className="card-icon transfers-icon"><FaExchangeAlt /></div>
            <div className="card-info">
              <h3>Room Transfer</h3>
              <p>{stats.roomTransfer}</p>
            </div>
          </div>

          <div className="card" onClick={() => navigate("/gate")}>
            <div className="card-icon" style={{ background: user?.currentStatus === 'Outside Hostel' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)', color: user?.currentStatus === 'Outside Hostel' ? '#ef4444' : '#22c55e' }}><FaWalking /></div>
            <div className="card-info">
              <h3>Current Status</h3>
              <p className="card-value-small">{user?.currentStatus || "Inside Hostel"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StuDashboard;
