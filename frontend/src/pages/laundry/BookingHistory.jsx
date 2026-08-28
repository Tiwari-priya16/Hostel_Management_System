import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { getMyLaundryBookings, cancelLaundryBooking } from "../../services/laundryService";
import { toast } from "react-toastify";
import { FaHistory, FaCalendarAlt, FaClock, FaTimesCircle } from "react-icons/fa";
import "../dashboard/dashboard.css";
import "../leave/LeaveHistory.css";

function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await getMyLaundryBookings();
      setBookings(res.bookings || []);
    } catch (error) {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await cancelLaundryBooking(id);
      toast.success("Booking cancelled successfully");
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel booking");
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />

        <div className="leave-history-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h1 style={{ margin: 0 }}>My Laundry Bookings</h1>
            <button className="rate-btn" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }} onClick={fetchBookings}>
              Refresh
            </button>
          </div>

          {loading ? (
            <p>Loading bookings...</p>
          ) : bookings.length === 0 ? (
            <div className="notice-empty">
              <FaHistory style={{ fontSize: '48px', opacity: 0.2, marginBottom: '15px' }} />
              <p>You haven't made any laundry bookings yet.</p>
            </div>
          ) : (
            <div className="complaint-table-container" style={{ overflowX: 'auto' }}>
              <table className="complaint-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Machine</th>
                    <th>Date</th>
                    <th>Slot</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id}>
                      <td><strong style={{ color: '#2563eb' }}>{booking.bookingId}</strong></td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span>Machine {booking.machine?.machineNumber}</span>
                          <small style={{ color: 'var(--text-muted)' }}>{booking.machine?.block}</small>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <FaCalendarAlt style={{ fontSize: '12px', color: 'var(--text-muted)' }} />
                          {booking.date}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <FaClock style={{ fontSize: '12px', color: 'var(--text-muted)' }} />
                          {booking.startTime} - {booking.endTime}
                        </div>
                      </td>
                      <td>
                        <span className={`status ${booking.status.toLowerCase()}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td>
                        {booking.status === "BOOKED" && (
                          <button
                            className="delete-btn"
                            style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px' }}
                            onClick={() => handleCancel(booking._id)}
                          >
                            <FaTimesCircle /> Cancel
                          </button>
                        )}
                        {booking.status === "ACTIVE" && <span style={{ color: '#22c55e', fontWeight: '600' }}>In Use</span>}
                        {booking.status === "COMPLETED" && <span style={{ color: 'var(--text-muted)' }}>Finished</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookingHistory;
