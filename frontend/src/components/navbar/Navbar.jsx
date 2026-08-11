import React from "react";
import "./Navbar.css";
import logo from "../../assets/hostelsync-logo.png";

function Navbar() {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  return (
    <div className="navbar">
      <div className="navbar-brand">
        <img
          src={logo}
          alt="HostelSync"
          className="navbar-logo"
        />
      </div>
      <div className="user-info">
        👤 {user?.name || "User"}
      </div>
    </div>
  );
}

export default Navbar;