import React, { useContext, useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import { FaSun, FaMoon, FaBell, FaUserCircle, FaArrowLeft } from "react-icons/fa";
import "./Navbar.css";
import logo from "../../assets/hostelsync-logo.png";

function Navbar() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [showNoti, setShowNoti] = useState(false);
  const [notiTab, setNotiTab] = useState("unread"); // unread, archived
  const dropdownRef = useRef(null);

  // Helper to get page title based on path
  const getPageTitle = (path) => {
    const titles = {
      "/dashboard/admin": "Admin Dashboard",
      "/dashboard/student": "Student Dashboard",
      "/admin/users": "Users Management",
      "/admin/users/students": "Student Details",
      "/admin/users/staff": "Staff Details",
      "/admin/mess": "Mess Management",
      "/admin/complaints": "Manage Complaints",
      "/admin/leaves": "Manage Leaves",
      "/admin/visitors": "Manage Visitors",
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
    };
    return titles[path] || "HostelSync";
  };

  const isDashboard = location.pathname.includes("/dashboard");
  const pageTitle = getPageTitle(location.pathname);

  // Initialize notifications based on role
  const [notifications, setNotifications] = useState(() => {
    const adminNotis = [
      { id: 1, text: "New complaint raised by Student A", time: "2m ago", read: false },
      { id: 2, text: "New leave request from Student B", time: "1h ago", read: false },
      { id: 3, text: "Notice posted: Independence Day Special Lunch", time: "5h ago", read: true },
    ];

    const studentNotis = [
      { id: 101, text: "Your leave request for 15th Aug has been approved", time: "10m ago", read: false },
      { id: 102, text: "New notice: Hostel fees due by next week", time: "2h ago", read: false },
      { id: 103, text: "Complaint #452 has been resolved", time: "1d ago", read: true },
    ];

    return user?.role === 'admin' ? adminNotis : studentNotis;
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const filteredNotis = notifications.filter(n => notiTab === "unread" ? !n.read : n.read);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const markRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

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

  return (
    <div className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="HostelSync" className="navbar-logo" />

        <div className="nav-divider"></div>

        {!isDashboard && (
          <button className="back-btn" onClick={() => navigate(-1)} title="Go Back">
            <FaArrowLeft />
          </button>
        )}

        <h2 className="current-page-title">{pageTitle}</h2>
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
                  <button className="mark-all-btn" onClick={markAllRead}>Mark all read</button>
                )}
              </div>

              <div className="noti-list">
                {filteredNotis.length > 0 ? (
                  filteredNotis.map(n => (
                    <div
                      key={n.id}
                      className={`noti-item ${!n.read ? 'unread' : 'read'}`}
                      onClick={() => markRead(n.id)}
                    >
                      <div className="noti-content">
                        <p>{n.text}</p>
                        <span>{n.time}</span>
                      </div>
                      {!n.read && <div className="unread-dot"></div>}
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

        <div className="user-profile">
          <div className="user-details">
            <span className="user-name">{user?.name || "User"}</span>
            <span className="user-role">{user?.role || "Student"}</span>
          </div>
          <FaUserCircle className="user-avatar" />
        </div>
      </div>
    </div>
  );
}

export default Navbar;