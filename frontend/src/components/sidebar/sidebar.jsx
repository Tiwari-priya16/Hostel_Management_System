import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import hLogo from "../../assets/h-icon.png";

import {
  FaTachometerAlt,
  FaClipboardList,
  FaCalendarAlt,
  FaTshirt,
  FaUsers,
  FaCommentDots,
  FaBullhorn,
  FaExchangeAlt,
  FaSignOutAlt,
} from "react-icons/fa";

function Sidebar() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const role = user?.role;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img
          src={hLogo}
          alt="HostelSync"
          className="sidebar-logo-img"
        />

        <h2>HostelSync</h2>
      </div>
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

      {/* Student Links */}
      {role === "student" && (
        <>
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
            to="/feedback"
            className={({ isActive }) =>
              isActive ? "active-link" : ""
            }
          >
            <FaCommentDots />
            Feedback
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
            to="/admin/feedback"
            className={({ isActive }) =>
              isActive ? "active-link" : ""
            }
          >
            <FaCommentDots />
            Feedback
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
        </>
      )}

      <button
        className="logout-btn"
        onClick={handleLogout}
      >
        <FaSignOutAlt />
        Logout
      </button>
    </div>
  );
}

export default Sidebar;