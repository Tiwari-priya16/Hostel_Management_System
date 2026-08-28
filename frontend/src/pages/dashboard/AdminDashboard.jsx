import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { getComplaintAnalytics } from "../../services/complaintService";
import { getLeaveAnalytics } from "../../services/leaveService";
import { getMachines, getAllLaundryBookings } from "../../services/laundryService";
import { getAllVisitors } from "../../services/visitorService";
import { getTransferAnalytics } from "../../services/roomTransferService";
import { getStudents, getStaff } from "../../services/userService";

import {
  getNoticeCount,
  getNotices,
  createNotice,
  deleteNotice,
} from "../../services/noticeService";

import { getGateAdminStats } from "../../services/gateService";

import {
  FaUsers,
  FaClipboardList,
  FaCalendarAlt,
  FaExchangeAlt,
  FaCommentDots,
  FaBullhorn,
  FaTshirt,
  FaPlus,
  FaUtensils,
  FaWalking,
} from "react-icons/fa";

import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    complaints: 0,
    visitors: 0,
    leaves: 0,
    transfers: 0,
    roomTransfers: 0, // Added to initial state for safety
    notices: 0,
    laundry: 0,
    users: 0,
    outside: 0,
  });

  const [noticesList, setNoticesList] = useState([]);
  const [showNoticeForm, setShowNoticeForm] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const res = await getNotices();
      setNoticesList(res.notices || []);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async () => {
    try {
      const [
        complaintRes,
        visitorRes,
        leaveRes,
        noticeRes,
        machineRes,
        bookingRes,
        transferRes,
        studentRes,
        staffRes,
        gateRes,
      ] = await Promise.all([
        getComplaintAnalytics(),
        getAllVisitors(),
        getLeaveAnalytics(),
        getNoticeCount(),
        getMachines(),
        getAllLaundryBookings(),
        getTransferAnalytics(),
        getStudents(),
        getStaff(),
        getGateAdminStats(),
      ]);

      setStats({
        complaints: complaintRes.data?.analytics?.pending || 0,
        visitors: visitorRes.visitors?.filter((v) => v.status === "Pending").length || 0,
        leaves: leaveRes.data?.analytics?.pending || 0,
        notices: noticeRes || 0,
        users: (studentRes.students?.length || 0) + (staffRes.staff?.length || 0),
        laundry: bookingRes.bookings?.filter(b => b.status === "ACTIVE").length || 0,
        roomTransfers: transferRes.analytics?.pending || 0,
        transfers: transferRes.analytics?.total || 0,
        outside: gateRes.stats?.totalOutside || 0,
      });
    } catch (error) {
      console.log("Admin Dashboard Fetch Error:", error);
    }
  };

  const handleNoticeSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await createNotice({ title, message });
      toast.success("Notice Sent Successfully");
      setTitle("");
      setMessage("");
      setShowNoticeForm(false);
      fetchData();
      fetchNotices();
    } catch (error) {
      toast.error("Failed to send notice");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNotice = async (id) => {
    if (!window.confirm("Delete this notice?")) return;
    try {
      await deleteNotice(id);
      toast.success("Notice Deleted");
      fetchNotices();
      fetchData();
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <h1 className="dashboard-title">Admin Dashboard</h1>
        <div className="stats-grid">
          <div className="card" onClick={() => navigate("/admin/users")}>
            <div className="card-icon users-icon"><FaUsers /></div>
            <div className="card-info">
              <h3>Total Users</h3>
              <h2>{stats.users}</h2>
            </div>
          </div>

          <div className="card" onClick={() => navigate("/admin/complaints")}>
            <div className="card-icon complaints-icon"><FaClipboardList /></div>
            <div className="card-info">
              <h3>Pending Complaints</h3>
              <h2>{stats.complaints}</h2>
            </div>
          </div>

          <div className="card" onClick={() => navigate("/admin/visitors")}>
            <div className="card-icon visitors-icon"><FaUsers /></div>
            <div className="card-info">
              <h3>Pending Visitors</h3>
              <h2>{stats.visitors}</h2>
            </div>
          </div>

          <div className="card" onClick={() => navigate("/admin/leaves")}>
            <div className="card-icon leaves-icon"><FaCalendarAlt /></div>
            <div className="card-info">
              <h3>Pending Leaves</h3>
              <h2>{stats.leaves}</h2>
            </div>
          </div>

          <div className="card" onClick={() => navigate("/admin/transfers")}>
            <div className="card-icon transfers-icon"><FaExchangeAlt /></div>
            <div className="card-info">
              <h3>Room Transfers</h3>
              <h2>{stats.roomTransfers}</h2>
            </div>
          </div>

          <div className="card" onClick={() => navigate("/admin/gate")}>
            <div className="card-icon leaves-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}><FaWalking /></div>
            <div className="card-info">
              <h3>Students Outside</h3>
              <h2>{stats.outside}</h2>
            </div>
          </div>

          <div className="card" onClick={() => navigate("/admin/mess")}>
            <div className="card-icon feedback-icon"><FaUtensils /></div>
            <div className="card-info">
              <h3>Mess Analytics</h3>
              <h2 className="card-value-small">Today</h2>
            </div>
          </div>

          <div className="card card-notice" onClick={() => setShowNoticeForm(true)}>
            <div className="card-icon notices-icon"><FaPlus /></div>
            <div className="card-info">
              <h3>Create Notice</h3>
              <h2>{stats.notices}</h2>
            </div>
          </div>

          <div className="card" onClick={() => navigate("/admin/laundry")}>
            <div className="card-icon laundry-icon"><FaTshirt /></div>
            <div className="card-info">
              <h3>Laundry Bookings</h3>
              <h2>{stats.laundry}</h2>
            </div>
          </div>
        </div>

        {showNoticeForm && (
          <div className="notice-popup">
            <div className="notice-popup-card">
              <div className="popup-header">
                <h2>Create Notice</h2>
                <button className="close-btn" onClick={() => setShowNoticeForm(false)}>✕</button>
              </div>
              <form onSubmit={handleNoticeSubmit}>
                <input type="text" placeholder="Notice Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                <textarea placeholder="Write Notice..." value={message} onChange={(e) => setMessage(e.target.value)} required />
                <button type="submit" className="send-btn" disabled={loading}>{loading ? "Sending..." : "Send Notice"}</button>
              </form>
              <div className="previous-notis">
                <h3>Previous Notices</h3>
                <div className="noti-scroll-list">
                  {noticesList.length === 0 ? (
                    <p className="no-notis">No notices yet.</p>
                  ) : (
                    noticesList.map((n) => (
                      <div key={n._id} className="mini-noti-card">
                        <div className="mini-noti-info">
                          <h4>{n.title}</h4>
                          <small>{new Date(n.createdAt).toLocaleDateString()}</small>
                        </div>
                        <button className="mini-delete-btn" onClick={() => handleDeleteNotice(n._id)} title="Delete Notice">✕</button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
