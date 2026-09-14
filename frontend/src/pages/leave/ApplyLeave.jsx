import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar/sidebar";
import Navbar from "../../components/navbar/Navbar";
import { applyLeave } from "../../services/leaveService";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";
import CustomDatePicker from "../../components/CustomDatePicker";

import "../dashboard/dashboard.css";
import "./ApplyLeave.css";

function ApplyLeave() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    reason: "",
    fromDate: null,
    toDate: null,
  });

  const [loading, setLoading] = useState(false);

  // Leave Policy: Only upcoming 30 days allowed
  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setDate(minDate.getDate() + 30);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fromDate || !formData.toDate) {
      toast.warning("Please select both dates");
      return;
    }

    try {
      setLoading(true);
      // Format dates to YYYY-MM-DD for the backend
      const formattedData = {
        ...formData,
        fromDate: formData.fromDate.toISOString().split('T')[0],
        toDate: formData.toDate.toISOString().split('T')[0],
      };

      await applyLeave(formattedData);

      toast.success("Leave applied successfully!");

      setFormData({
        reason: "",
        fromDate: null,
        toDate: null,
      });

      navigate("/my-leaves");
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
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                rows="5"
                required
              />

              <label>From Date</label>
              <CustomDatePicker
                selected={formData.fromDate}
                onChange={(date) => setFormData({ ...formData, fromDate: date })}
                placeholderText="Select start date"
                minDate={minDate}
                maxDate={maxDate}
                required
              />

              <label>To Date</label>
              <CustomDatePicker
                selected={formData.toDate}
                onChange={(date) => setFormData({ ...formData, toDate: date })}
                placeholderText="Select end date"
                minDate={formData.fromDate || minDate}
                maxDate={maxDate}
                required
              />

              <button type="submit" disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                {loading ? <><FaSpinner className="spinner" /> Applying...</> : "Apply Leave"}
              </button>

              <button
                type="button"
                style={{ marginTop: "10px" }}
                onClick={() => navigate("/my-leaves")}
              >
                View My Leaves
              </button>

            </form>

          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplyLeave;
