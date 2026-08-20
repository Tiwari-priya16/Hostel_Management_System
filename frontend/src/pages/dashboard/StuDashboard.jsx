import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";

import { getMyComplaints } from "../../services/complaintService";
import { getMyLeaves } from "../../services/leaveService";
import { getMyLaundry } from "../../services/laundryService";
import { getMyVisitors } from "../../services/visitorService";
import { getMyFeedback } from "../../services/feedbackService";
import { getMyTransfers } from "../../services/roomTransferService";

import {
  FaClipboardList,
  FaCalendarAlt,
  FaTshirt,
  FaUsers,
  FaCommentDots,
  FaExchangeAlt,
} from "react-icons/fa";

import "./dashboard.css";

function StuDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [stats, setStats] = useState({
    complaints: 0,
    leaves: 0,
    laundry: 0,
    visitors: 0,
    feedback: 0,
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
        feedbackRes,
        transferRes,
      ] = await Promise.all([
        getMyComplaints(),
        getMyLeaves(),
        getMyLaundry(),
        getMyVisitors(),
        getMyFeedback(),
        getMyTransfers(),
      ]);

      console.log("Complaint:", complaintRes);
      console.log("Leave:", leaveRes);
      console.log("Laundry:", laundryRes);
      console.log("Visitors:", visitorRes);
      console.log("Feedback:", feedbackRes);
      console.log("Transfer:", transferRes);

      setStats({
        complaints:
          complaintRes?.complaints?.length ||
          complaintRes?.data?.complaints?.length ||
          0,

        leaves:
          leaveRes?.leaves?.length ||
          leaveRes?.data?.leaves?.length ||
          0,

        laundry:
          laundryRes?.bookings?.length ||
          laundryRes?.data?.bookings?.length ||
          0,

        visitors:
          visitorRes?.visitors?.length ||
          visitorRes?.data?.visitors?.length ||
          0,

        feedback:
          feedbackRes?.feedbacks?.length ||
          feedbackRes?.data?.feedbacks?.length ||
          0,

        roomTransfer:
          transferRes?.transfers?.length ||
          transferRes?.data?.transfers?.length ||
          0,
      });
    } catch (error) {
      console.log(
        "Dashboard Error:",
        error
      );
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="content">
        <Navbar />

        <h1 className="welcome-text">
          Welcome, {user?.name}
        </h1>

        <div className="cards">

          <div
            className="card"
            onClick={() =>
              navigate("/my-complaints")
            }
          >
            <div className="card-icon complaints-icon"><FaClipboardList /></div>
            <div className="card-info">
              <h3>Complaints</h3>
              <p>{stats.complaints}</p>
            </div>
          </div>

          <div
            className="card"
            onClick={() =>
              navigate("/my-leaves")
            }
          >
            <div className="card-icon leaves-icon"><FaCalendarAlt /></div>
            <div className="card-info">
              <h3>Leave Requests</h3>
              <p>{stats.leaves}</p>
            </div>
          </div>

          <div
            className="card"
            onClick={() =>
              navigate("/laundry/history")
            }
          >
            <div className="card-icon laundry-icon"><FaTshirt /></div>
            <div className="card-info">
              <h3>Laundry</h3>
              <p>{stats.laundry}</p>
            </div>
          </div>

          <div
            className="card"
            onClick={() =>
              navigate("/visitors/history")
            }
          >
            <div className="card-icon visitors-icon"><FaUsers /></div>
            <div className="card-info">
              <h3>Visitors</h3>
              <p>{stats.visitors}</p>
            </div>
          </div>

          <div
            className="card"
            onClick={() =>
              navigate("/feedback/history")
            }
          >
            <div className="card-icon feedback-icon"><FaCommentDots /></div>
            <div className="card-info">
              <h3>Feedback</h3>
              <p>{stats.feedback}</p>
            </div>
          </div>

          <div
            className="card"
            onClick={() =>
              navigate("/room-transfer/history")
            }
          >
            <div className="card-icon transfers-icon"><FaExchangeAlt /></div>
            <div className="card-info">
              <h3>Room Transfer</h3>
              <p>{stats.roomTransfer}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default StuDashboard;