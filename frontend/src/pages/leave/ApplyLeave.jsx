import React, { useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { applyLeave } from "../../services/leaveService";

import "../dashboard/dashboard.css";
import "./ApplyLeave.css";

function ApplyLeave() {
  const [formData, setFormData] = useState({
    reason: "",
    fromDate: "",
    toDate: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await applyLeave(formData);

      toast.success("Leave applied successfully!");

      setFormData({
        reason: "",
        fromDate: "",
        toDate: "",
      });

    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to apply leave");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="content">
        <Navbar />

        <div className="leave-container">
          <div className="leave-card">

            <h1>Apply Leave</h1>

            <form onSubmit={handleSubmit}>

              <textarea
                name="reason"
                placeholder="Reason for leave"
                value={formData.reason}
                onChange={handleChange}
                rows="5"
                required
              />

              <label>From Date</label>
              <input
                type="date"
                name="fromDate"
                value={formData.fromDate}
                onChange={handleChange}
                required
              />

              <label>To Date</label>
              <input
                type="date"
                name="toDate"
                value={formData.toDate}
                onChange={handleChange}
                required
              />

              <button type="submit" disabled={loading}>
                {loading ? "Applying..." : "Apply Leave"}
              </button>

            </form>

          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplyLeave;