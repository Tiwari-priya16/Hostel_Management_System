import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createVisitor } from "../../services/visitorService";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";
import Sidebar from "../../components/sidebar/sidebar";
import Navbar from "../../components/navbar/Navbar";
import CustomDatePicker from "../../components/CustomDatePicker";

import "../dashboard/dashboard.css";
import "../leave/ApplyLeave.css";

function AddVisitor() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    visitorName: "",
    phone: "",
    relation: "",
    visitDate: null,
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

    if (!formData.visitDate) {
      toast.warning("Please select a visit date");
      return;
    }

    try {
      setLoading(true);
      const formattedData = {
        ...formData,
        visitDate: formData.visitDate.toISOString().split('T')[0],
      };

      await createVisitor(formattedData);

      toast.success("Visitor request submitted");

      setFormData({
        visitorName: "",
        phone: "",
        relation: "",
        visitDate: null,
      });

      navigate("/visitors/history");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add visitor");
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

          <h1>Add Visitor</h1>

          <form onSubmit={handleSubmit}>

            <input
              type="text"
              name="visitorName"
              placeholder="Visitor Name"
              value={formData.visitorName}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="relation"
              placeholder="Relation"
              value={formData.relation}
              onChange={handleChange}
              required
            />

            <label>Visit Date</label>

            <CustomDatePicker
              selected={formData.visitDate}
              onChange={(date) => setFormData({ ...formData, visitDate: date })}
              placeholderText="Select visit date"
              minDate={new Date()}
              required
            />

            <button type="submit" disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              {loading ? <><FaSpinner className="spinner" /> Adding...</> : "Add Visitor"}
            </button>

            <button
              type="button"
              style={{ marginTop: "10px" }}
              onClick={() =>
                navigate(
                  "/visitors/history"
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

export default AddVisitor;