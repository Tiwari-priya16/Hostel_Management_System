
import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import { useNavigate } from "react-router-dom";

import { getComplaintAnalytics } from "../../services/complaintService";
import { getLeaveAnalytics } from "../../services/leaveService";
import { getFeedbackAnalytics } from "../../services/feedbackService";
import { getLaundryAnalytics } from "../../services/laundryService";
import { getAllVisitors } from "../../services/visitorService";
import { getTransferAnalytics } from "../../services/roomTransferService";
import { getStudents, getStaff } from "../../services/userService";

import {
  getNoticeCount,
  createNotice,
} from "../../services/noticeService";

import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    complaints: 0,
    visitors: 0,
    leaves: 0,
    transfers: 0,
    feedback: 0,
    notices: 0,
    laundry: 0,
    users: 0,
  });

  const [showNoticeForm, setShowNoticeForm] =
    useState(false);

  const [title, setTitle] = useState("");
  const [message, setMessage] =
    useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
const [
  complaintRes,
  visitorRes,
  leaveRes,
  feedbackRes,
  noticeRes,
  laundryRes,
  transferRes,
  studentRes,
  staffRes,
] = await Promise.all([
  getComplaintAnalytics(),
  getAllVisitors(),
  getLeaveAnalytics(),
  getFeedbackAnalytics(),
  getNoticeCount(),
  getLaundryAnalytics(),
  getTransferAnalytics(),
  getStudents(),
  getStaff(),
]);

      setStats({
        complaints:
          complaintRes.data?.analytics
            ?.pending || 0,

        visitors:
          visitorRes.visitors?.filter(
            (v) =>
              v.status === "Pending"
          ).length || 0,

        leaves:
          leaveRes.data?.analytics
            ?.pending || 0,

        feedback:
          feedbackRes.analytics
            ?.total || 0,

        notices:
          noticeRes || 0,

        users:
        (studentRes.students?.length || 0) +
        (staffRes.staff?.length || 0),

        laundry:
          laundryRes.analytics
            ?.booked || 0,

          roomTransfers: transferRes.analytics?.pending || 0,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleNoticeSubmit = async (
    e
  ) => {
    e.preventDefault();

    try {
      await createNotice({
        title,
        message,
      });

      alert(
        "Notice Sent Successfully"
      );

      setTitle("");
      setMessage("");

      setShowNoticeForm(false);

      fetchData();
    } catch (error) {
      console.log(error);
      alert(
        "Failed to send notice"
      );
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="main-content">
        <Navbar />

        <h1 className="dashboard-title">
          Admin Dashboard
        </h1>

        <div className="stats-grid">

          <div
            className="card"
            onClick={() =>
              navigate("/admin/users")
            }
          >
            <h3>Users</h3>

            <h2>{stats.users}</h2>

        
          </div>

          <div
            className="card"
            onClick={() =>
              navigate(
                "/admin/complaints"
              )
            }
          >
            <h3>
              Pending Complaints
            </h3>
            <h2>
              {stats.complaints}
            </h2>
          </div>

          <div
            className="card"
            onClick={() =>
              navigate(
                "/admin/visitors"
              )
            }
          >
            <h3>
              Pending Visitors
            </h3>
            <h2>
              {stats.visitors}
            </h2>
          </div>

          <div
            className="card"
            onClick={() =>
              navigate(
                "/admin/leaves"
              )
            }
          >
            <h3>Pending Leaves</h3>
            <h2>{stats.leaves}</h2>
          </div>

          <div
            className="card"
            onClick={() =>
              navigate("/admin/transfers")
            }
          >
            <h3>Room Transfers</h3>
            <h2>{stats.roomTransfers}</h2>
          </div>

          <div
            className="card"
            onClick={() =>
              navigate(
                "/admin/feedback"
              )
            }
          >
            <h3>Total Feedback</h3>
            <h2>
              {stats.feedback}
            </h2>
          </div>

          <div
            className="card"
            onClick={() =>
              setShowNoticeForm(true)
            }
          >
            <h3>Notices</h3>
            <h2>{stats.notices}</h2>
          </div>

          <div
            className="card"
            onClick={() =>
              navigate("/admin/laundry")
            }
          >
            <h3>Laundry Bookings</h3>
            <h2>{stats.laundry}</h2>
          </div>

        </div>

        {showNoticeForm && (
          <div className="notice-popup">
            <div className="notice-popup-card">

              <div className="popup-header">
                <h2>
                  Create Notice
                </h2>

                <button
                  className="close-btn"
                  onClick={() =>
                    setShowNoticeForm(
                      false
                    )
                  }
                >
                  ✕
                </button>
              </div>

              <form
                onSubmit={
                  handleNoticeSubmit
                }
              >
                <input
                  type="text"
                  placeholder="Notice Title"
                  value={title}
                  onChange={(e) =>
                    setTitle(
                      e.target.value
                    )
                  }
                  required
                />

                <textarea
                  placeholder="Write Notice..."
                  value={message}
                  onChange={(e) =>
                    setMessage(
                      e.target.value
                    )
                  }
                  required
                />

                <button
                  type="submit"
                  className="send-btn"
                >
                  Send Notice
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default AdminDashboard;