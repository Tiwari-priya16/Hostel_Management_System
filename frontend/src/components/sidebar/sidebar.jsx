import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import "./sidebar.css";
import hLogo from "../../assets/h-icon.png";

import {
  FaTachometerAlt,
  FaClipboardList,
  FaCalendarAlt,
  FaTshirt,
  FaUsers,
  FaBullhorn,
  FaExchangeAlt,
  FaSignOutAlt,
  FaUtensils,
  FaUser,
  FaWalking,
  FaComments,
  FaTimes,
} from "react-icons/fa";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  // Listen for navbar hamburger click & route changes
  useEffect(() => {
    const handleToggle = () => setMobileOpen((prev) => !prev);
    const handleClose = () => setMobileOpen(false);

    window.addEventListener("toggle-sidebar", handleToggle);
    window.addEventListener("close-sidebar", handleClose);

    return () => {
      window.removeEventListener("toggle-sidebar", handleToggle);
      window.removeEventListener("close-sidebar", handleClose);
    };
  }, []);

  // Close sidebar automatically on mobile when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <>
      {/* Dark Overlay Backdrop on Mobile when Sidebar is open */}
      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileOpen(false)}
        ></div>
      )}

      <div className={`sidebar ${mobileOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-logo">
          <img
            src={hLogo}
            alt="HostelSync"
            className="sidebar-logo-img"
          />
          <h2>HostelSync</h2>
          <button
            className="mobile-close-btn"
            onClick={() => setMobileOpen(false)}
          >
            <FaTimes />
          </button>
        </div>

        <div className="sidebar-links">
          {/* Dashboard */}
          <NavLink
            to={`/dashboard/${role}`}
            className={({ isActive }) =>
              isActive ? "active-link" : ""
            }
          >
            <FaTachometerAlt />
            Dashboard
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive ? "active-link" : ""
            }
          >
            <FaUser />
            My Profile
          </NavLink>

          <NavLink
            to="/community"
            className={({ isActive }) =>
              isActive ? "active-link" : ""
            }
          >
            <FaComments />
            Community Hub
          </NavLink>

          {/* Student Links */}
          {role === "student" && (
            <>
              <NavLink
                to="/mess"
                className={({ isActive }) =>
                  isActive ? "active-link" : ""
                }
              >
                <FaUtensils />
                Mess & Feedback
              </NavLink>

              <NavLink
                to="/complaints"
                className={({ isActive }) =>
                  isActive ? "active-link" : ""
                }
              >
                <FaClipboardList />
                Complaints
              </NavLink>

              <NavLink
                to="/leave"
                className={({ isActive }) =>
                  isActive ? "active-link" : ""
                }
              >
                <FaCalendarAlt />
                Leave
              </NavLink>

              <NavLink
                to="/laundry"
                className={({ isActive }) =>
                  isActive ? "active-link" : ""
                }
              >
                <FaTshirt />
                Laundry
              </NavLink>

              <NavLink
                to="/visitors"
                className={({ isActive }) =>
                  isActive ? "active-link" : ""
                }
              >
                <FaUsers />
                Visitors
              </NavLink>

              <NavLink
                to="/notices"
                className={({ isActive }) =>
                  isActive ? "active-link" : ""
                }
              >
                <FaBullhorn />
                Notices
              </NavLink>

              <NavLink
                to="/room-transfer"
                className={({ isActive }) =>
                  isActive ? "active-link" : ""
                }
              >
                <FaExchangeAlt />
                Room Transfer
              </NavLink>

              <NavLink
                to="/gate"
                className={({ isActive }) =>
                  isActive ? "active-link" : ""
                }
              >
                <FaWalking />
                Entry / Exit
              </NavLink>
            </>
          )}

          {/* Warden / Caretaker / Staff Links */}
          {(role === "warden" || role === "staff") && (
            <>
              <NavLink
                to="/admin/complaints"
                className={({ isActive }) =>
                  isActive ? "active-link" : ""
                }
              >
                <FaClipboardList />
                Complaints
              </NavLink>

              <NavLink
                to="/admin/leaves"
                className={({ isActive }) =>
                  isActive ? "active-link" : ""
                }
              >
                <FaCalendarAlt />
                Leave Approvals
              </NavLink>

              <NavLink
                to="/admin/gate"
                className={({ isActive }) =>
                  isActive ? "active-link" : ""
                }
              >
                <FaWalking />
                Gate & Curfew
              </NavLink>

              <NavLink
                to="/admin/laundry"
                className={({ isActive }) =>
                  isActive ? "active-link" : ""
                }
              >
                <FaTshirt />
                Laundry Care
              </NavLink>

              <NavLink
                to="/admin/visitors"
                className={({ isActive }) =>
                  isActive ? "active-link" : ""
                }
              >
                <FaUsers />
                Visitors Log
              </NavLink>

              <NavLink
                to="/admin/notices"
                className={({ isActive }) =>
                  isActive ? "active-link" : ""
                }
              >
                <FaBullhorn />
                Notices
              </NavLink>
            </>
          )}

          {/* Admin Links */}
          {role === "admin" && (
            <>
              <NavLink
                to="/admin/users"
                className={({ isActive }) =>
                  isActive ? "active-link" : ""
                }
              >
                <FaUsers />
                Users
              </NavLink>

              <NavLink
                to="/admin/mess"
                className={({ isActive }) =>
                  isActive ? "active-link" : ""
                }
              >
                <FaUtensils />
                Mess & Analytics
              </NavLink>

              <NavLink
                to="/admin/complaints"
                className={({ isActive }) =>
                  isActive ? "active-link" : ""
                }
              >
                <FaClipboardList />
                Complaints
              </NavLink>

              <NavLink
                to="/admin/leaves"
                className={({ isActive }) =>
                  isActive ? "active-link" : ""
                }
              >
                <FaCalendarAlt />
                Leaves
              </NavLink>

              <NavLink
                to="/admin/visitors"
                className={({ isActive }) =>
                  isActive ? "active-link" : ""
                }
              >
                <FaUsers />
                Visitors
              </NavLink>

              <NavLink
                to="/admin/laundry"
                className={({ isActive }) =>
                  isActive ? "active-link" : ""
                }
              >
                <FaTshirt />
                Laundry
              </NavLink>

              <NavLink
                to="/admin/notices"
                className={({ isActive }) =>
                  isActive ? "active-link" : ""
                }
              >
                <FaBullhorn />
                Notices
              </NavLink>

              <NavLink
                to="/admin/transfers"
                className={({ isActive }) =>
                  isActive ? "active-link" : ""
                }
              >
                <FaExchangeAlt />
                Room Transfer
              </NavLink>

              <NavLink
                to="/admin/gate"
                className={({ isActive }) =>
                  isActive ? "active-link" : ""
                }
              >
                <FaWalking />
                Gate Tracking
              </NavLink>
            </>
          )}
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </>
  );
}

export default Sidebar;
