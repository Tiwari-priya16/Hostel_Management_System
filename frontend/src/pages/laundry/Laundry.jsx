import React, { useState } from "react";
import { createLaundry } from "../../services/laundryService";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";

import "../dashboard/dashboard.css";
import "../leave/ApplyLeave.css";

function Laundry() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    machineNumber: "",
    slotDate: "",
    startTime: "",
    endTime: "",
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
      await createLaundry(formData);

      alert("Laundry slot booked successfully");

      setFormData({
        machineNumber: "",
        slotDate: "",
        startTime: "",
        endTime: "",
      });

      navigate("/laundry/history");
    } catch (err) {
      console.log(err);
      alert(
        err.response?.data?.message ||
          "Booking failed"
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

          <h1>Book Laundry Slot</h1>

          <form onSubmit={handleSubmit}>

            <input
              type="number"
              name="machineNumber"
              placeholder="Machine Number"
              value={formData.machineNumber}
              onChange={handleChange}
              required
            />

            <input
              type="date"
              name="slotDate"
              value={formData.slotDate}
              onChange={handleChange}
              required
            />

            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              required
            />

            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              required
            />

            <button type="submit">
              Book Slot
            </button>

            <button
              type="button"
              style={{ marginTop: "10px" }}
              onClick={() =>
                navigate("/laundry/history")
              }
            >
              View My Bookings
            </button>

          </form>

        </div>
      </div>
    </div>
  </div>
);
}

export default Laundry;