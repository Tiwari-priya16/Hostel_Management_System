import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { applyTransfer } from "../../services/roomTransferService";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";

import "../dashboard/dashboard.css";
import "../leave/ApplyLeave.css";

function RequestTransfer() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    currentRoom: "",
    requestedRoom: "",
    reason: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await applyTransfer(formData);

      alert("Room transfer request submitted");

      setFormData({
        currentRoom: "",
        requestedRoom: "",
        reason: "",
      });

      navigate("/room-transfer/history");
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Failed to submit request"
      );
    }
  };

 return (
  <div className="dashboard-container">
    <Sidebar />

    <div className="content">
      <Navbar />

      <div className="leave-container">
        <div className="leave-card">

          <h1>Room Transfer Request</h1>

          <form onSubmit={handleSubmit}>

            <input
              type="text"
              name="currentRoom"
              placeholder="Current Room Number"
              value={formData.currentRoom}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="requestedRoom"
              placeholder="Requested Room Number"
              value={formData.requestedRoom}
              onChange={handleChange}
              required
            />

            <textarea
              name="reason"
              placeholder="Reason for transfer"
              rows="5"
              value={formData.reason}
              onChange={handleChange}
              required
            />

            <button type="submit">
              Submit Request
            </button>

            <button
              type="button"
              style={{ marginTop: "10px" }}
              onClick={() =>
                navigate(
                  "/room-transfer/history"
                )
              }
            >
              View History
            </button>

          </form>

        </div>
      </div>
    </div>
  </div>
);
}

export default RequestTransfer;