
import React, { useEffect, useState } from "react";

import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";

import {
  getAllLaundry,
  completeLaundry,
  deleteLaundry,
} from "../../services/laundryService";

import "../complaint/ComplaintList.css";
import "../dashboard/dashboard.css";

function AdminLaundry() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await getAllLaundry();

      setBookings(res.bookings || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleComplete = async (id) => {
    try {
      await completeLaundry(id);

      alert("Laundry marked as completed");

      fetchBookings();
    } catch (error) {
      console.log(error);
      alert("Failed to update booking");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this booking?"
    );

    if (!confirmDelete) return;

    try {
      await deleteLaundry(id);

      alert("Booking deleted successfully");

      fetchBookings();
    } catch (error) {
      console.log(error);
      alert("Failed to delete booking");
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="content">
        <Navbar />

        <div className="complaint-list-container">
          <h1>Laundry Management</h1>

          <table className="complaint-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Room</th>
                <th>Machine</th>
                <th>Date</th>
                <th>Start</th>
                <th>End</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td>
                    {booking.student?.name || "N/A"}
                  </td>

                  <td>
                    {booking.student?.roomNumber || "N/A"}
                  </td>

                  <td>
                    {booking.machineNumber}
                  </td>

                  <td>
                    {new Date(
                      booking.slotDate
                    ).toLocaleDateString("en-IN")}
                  </td>

                  <td>{booking.startTime}</td>

                  <td>{booking.endTime}</td>

                  <td>
                    <span
                      className={`status ${booking.status
                        .replace(/\s/g, "")
                        .toLowerCase()}`}
                    >
                      {booking.status}
                    </span>
                  </td>

                  <td>
                    {booking.status ===
                    "Booked" ? (
                      <button
                        onClick={() =>
                          handleComplete(
                            booking._id
                          )
                        }
                        style={{
                          background:
                            "#2563eb",
                          color: "#fff",
                          border: "none",
                          padding:
                            "8px 14px",
                          borderRadius:
                            "6px",
                          cursor:
                            "pointer",
                        }}
                      >
                        Complete
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          handleDelete(
                            booking._id
                          )
                        }
                        style={{
                          background:
                            "#ef4444",
                          color: "#fff",
                          border: "none",
                          padding:
                            "8px 14px",
                          borderRadius:
                            "6px",
                          cursor:
                            "pointer",
                        }}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {bookings.length === 0 && (
            <p>
              No laundry bookings
              found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminLaundry;

