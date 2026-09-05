import React, { useContext, useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import { FaSun, FaMoon, FaBell, FaUserCircle, FaArrowLeft, FaBars } from "react-icons/fa";
import { getNotifications, markAsRead, markAllAsRead } from "../../services/notificationService";
import { toast } from "react-toastify";
import "./Navbar.css";
import hLogo from "../../assets/h-icon.png";

function Navbar() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [showNoti, setShowNoti] = useState(false);
  const [notiTab, setNotiTab] = useState("unread"); // unread, archived
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      // Polling every 30 seconds for new notifications
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await getNotifications();
      if (res.success) {
        setNotifications(res.notifications);
      }
    } catch (error) {
      console.error("Fetch Notifications Error:", error);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await markAsRead(id);
      fetchNotifications();
    } catch (error) {
      toast.error("Failed to mark as read");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      fetchNotifications();
      toast.success("All notifications archived");
    } catch (error) {
      toast.error("Failed to mark all as read");
    }
  };

  // Helper to get page title based on path
  const getPageTitle = (path) => {
    const titles = {
      "/dashboard/admin": "Admin Dashboard",
      "/dashboard/student": "Student Dashboard",
      "/dashboard/staff": "Warden Operations",
      "/dashboard/warden": "Warden Operations",
      "/admin/users": "Users Management",
      "/admin/users/students": "Student Details",
      "/admin/users/staff": "Staff Details",
      "/admin/mess": "Mess Management",
      "/admin/complaints": "Manage Complaints",
      "/admin/leaves": "Manage Leaves",
      "/admin/visitors": "Manage Visitors",
      "/admin/gate": "Gate Tracking",
      "/admin/laundry": "Laundry Management",
      "/admin/feedback": "Manage Feedback",
      "/admin/notices": "Manage Notices",
      "/admin/transfers": "Room Transfers",
      "/mess": "Mess Menu",
      "/complaints": "Raise Complaint",
      "/my-complaints": "My Complaints",
      "/leave": "Apply Leave",
      "/my-leaves": "My Leave History",
      "/laundry": "Book Laundry",
      "/laundry/history": "Laundry History",
      "/visitors": "Add Visitor",
      "/visitors/history": "Visitor History",
      "/feedback": "Give Feedback",
      "/feedback/history": "Feedback History",
      "/room-transfer": "Room Transfer Request",
      "/room-transfer/history": "Transfer History",
      "/notices": "Notice Board",
      "/gate": "Entry / Exit Pass",
      "/community": "Community Hub",
      "/profile": "My Profile",
    };
    return titles[path] || "";
  };

  const isDashboard = location.pathname.includes("/dashboard");
  const pageTitle = getPageTitle(location.pathname);

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const filteredNotis = notifications.filter(n => notiTab === "unread" ? !n.isRead : n.isRead);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNoti(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const triggerToggleSidebar = () => {
    window.dispatchEvent(new CustomEvent("toggle-sidebar"));
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <button className="hamburger-btn" onClick={triggerToggleSidebar} title="Open Menu">
          <FaBars />
        </button>

        <div className="navbar-brand" onClick={() => navigate(`/dashboard/${user?.role || "student"}`)} style={{ cursor: "pointer" }}>
          <img src={hLogo} alt="HostelSync" className="navbar-brand-logo" />
          <span className="navbar-brand-text">HostelSync</span>
        </div>

        {pageTitle && pageTitle !== "HostelSync" && (
          <>
            <div className="nav-divider"></div>

            {!isDashboard && (
              <button className="back-btn" onClick={() => navigate(-1)} title="Go Back">
                <FaArrowLeft />
              </button>
            )}

            <h2 className="current-page-title">{pageTitle}</h2>
          </>
        )}
      </div>

      <div className="navbar-right">
        <button className="theme-toggle" onClick={toggleTheme} title="Toggle Theme">
          {theme === 'light' ? <FaMoon /> : <FaSun />}
        </button>

        <div className="nav-icon-container" ref={dropdownRef}>
          <button className="nav-icon" onClick={() => setShowNoti(!showNoti)}>
            <FaBell />
            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
          </button>

          {showNoti && (
            <div className="notification-dropdown">
              <div className="noti-header">
                <div className="noti-tabs">
                  <span
                    className={notiTab === 'unread' ? 'active' : ''}
                    onClick={() => setNotiTab('unread')}
                  >
                    New ({unreadCount})
                  </span>
                  <span
                    className={notiTab === 'archived' ? 'active' : ''}
                    onClick={() => setNotiTab('archived')}
                  >
                    Archived
                  </span>
                </div>
                {notiTab === 'unread' && unreadCount > 0 && (
                  <button className="mark-all-btn" onClick={handleMarkAllRead}>Mark all read</button>
                )}
              </div>

              <div className="noti-list">
                {filteredNotis.length > 0 ? (
                  filteredNotis.map(n => (
                    <div
                      key={n._id}
                      className={`noti-item ${!n.isRead ? 'unread' : 'read'}`}
                      onClick={() => handleMarkRead(n._id)}
                    >
                      <div className="noti-content">
                        <p>{n.message}</p>
                        <span>{new Date(n.createdAt).toLocaleString()}</span>
                      </div>
                      {!n.isRead && <div className="unread-dot"></div>}
                    </div>
                  ))
                ) : (
                  <p className="no-noti">
                    {notiTab === 'unread' ? "All caught up!" : "No archived notifications"}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="user-profile" onClick={() => navigate("/profile")} style={{ cursor: 'pointer' }}>
          <div className="user-details">
            <span className="user-name">{user?.name || "User"}</span>
            <span className="user-role">{user?.role || "Student"}</span>
          </div>
          {user?.profilePic ? (
            <img src={user.profilePic} alt={user.name} className="user-avatar-img" />
          ) : (
            <FaUserCircle className="user-avatar" />
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
