import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createVisitor } from "../../services/visitorService";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";

import "../dashboard/dashboard.css";
import "../leave/ApplyLeave.css";

function AddVisitor() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    visitorName: "",
    phone: "",
    relation: "",
    visitDate: "",
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
      await createVisitor(formData);

      alert("Visitor request submitted");

      setFormData({
        visitorName: "",
        phone: "",
        relation: "",
        visitDate: "",
      });

      navigate("/visitors/history");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to add visitor"
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

            <input
              type="date"
              name="visitDate"
              value={formData.visitDate}
              onChange={handleChange}
              required
            />

            <button type="submit">
              Add Visitor
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