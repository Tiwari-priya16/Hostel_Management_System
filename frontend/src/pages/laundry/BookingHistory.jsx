import React, {
  useEffect,
  useState,
} from "react";

import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";

import "../dashboard/dashboard.css";
import "../leave/LeaveHistory.css";

import {
  getMyLaundry,
  cancelLaundry,
} from "../../services/laundryService";

function BookingHistory() {
  const [bookings, setBookings] =
    useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res =
        await getMyLaundry();

      setBookings(
        res.bookings || []
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = async (
    id
  ) => {
    try {
      await cancelLaundry(id);

      alert(
        "Booking cancelled successfully"
      );

      fetchBookings();
    } catch (error) {
      alert(
        error.response?.data
          ?.message ||
          "Failed to cancel booking"
      );
    }
  };

return (
  <div className="dashboard-container">
    <Sidebar />

    <div className="content">
      <Navbar />

      <div className="leave-history-container">
        <h1>My Laundry Bookings</h1>

        {bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <table className="leave-table">
            <thead>
              <tr>
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
                  <td>{booking.machineNumber}</td>

                  <td>
                    {new Date(
                      booking.slotDate
                    ).toLocaleDateString("en-IN")}
                  </td>

                  <td>{booking.startTime}</td>

                  <td>{booking.endTime}</td>

                  <td>
                    <span
                      className={`status ${booking.status.toLowerCase()}`}
                    >
                      {booking.status}
                    </span>
                  </td>

                  <td>
                    {booking.status ===
                    "Booked" ? (
                      <button
                        onClick={() =>
                          handleCancel(
                            booking._id
                          )
                        }
                      >
                        Cancel
                      </button>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  </div>
);
}

export default BookingHistory;