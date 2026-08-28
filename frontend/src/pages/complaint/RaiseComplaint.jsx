import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";

import { createComplaint } from "../../services/complaintService";
import { toast } from "react-toastify";

import "../dashboard/dashboard.css";
import "./RaiseComplaint.css";

function RaiseComplaint() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "General",
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
      await createComplaint(formData);

      toast.success("Complaint submitted successfully!");

      setFormData({
        title: "",
        description: "",
        category: "General",
      });

      navigate("/my-complaints");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to raise complaint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="content">
        <Navbar />

        <div className="complaint-container">
          <div className="complaint-card">

            <h1>Raise Complaint</h1>

            <form onSubmit={handleSubmit}>

              <input
                type="text"
                name="title"
                placeholder="Complaint Title"
                value={formData.title}
                onChange={handleChange}
                required
              />

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="Water">Water</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Internet">Internet</option>
                <option value="Furniture">Furniture</option>
                <option value="Other">Other</option>
              </select>

              <textarea
                name="description"
                placeholder="Describe your issue"
                rows="5"
                value={formData.description}
                onChange={handleChange}
                required
              />

              <button type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit Complaint"}
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/my-complaints"
                  )
                }
              >
                View My Complaints
              </button>

            </form>

          </div>
        </div>
      </div>
    </div>
  );
}

export default RaiseComplaint;