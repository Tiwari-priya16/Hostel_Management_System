import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import {
  getMachines,
  createLaundryBooking,
  getMyLaundryBookings,
  getLaundrySettings,
  reportMachineProblem,
  getMachineBookedSlots
} from "../../services/laundryService";
import { toast } from "react-toastify";
import { FaTshirt, FaTools, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import "./Laundry.css";

function Laundry() {
  const [machines, setMachines] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(null); // machine object

  const now = new Date();
  const todayDate = now.toISOString().split('T')[0];
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowDate = tomorrow.toISOString().split('T')[0];
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const [selectedDate, setSelectedDate] = useState(todayDate);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);
  const [showReportModal, setShowReportModal] = useState(null); // machine object
  const [reportData, setReportData] = useState({ issueType: "Machine not starting", description: "" });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (showBookingModal) {
      fetchBookedSlots(showBookingModal._id, selectedDate);
    }
  }, [showBookingModal, selectedDate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [machineRes, bookingRes, settingsRes] = await Promise.all([
        getMachines(),
        getMyLaundryBookings(),
        getLaundrySettings()
      ]);
      setMachines(machineRes.machines);
      setMyBookings(bookingRes.bookings);
      setSettings(settingsRes.settings);
    } catch (error) {
      toast.error("Failed to load laundry data");
    } finally {
      setLoading(false);
    }
  };

  const fetchBookedSlots = async (machineId, date) => {
    try {
      const res = await getMachineBookedSlots(machineId, date);
      setBookedSlots(res.bookedSlots || []);
    } catch (error) {
      console.error(error);
    }
  };

  // Active current/upcoming booking (past bookings from previous days/hours are ignored)
  const activeBooking = myBookings.find(b =>
    (b.status === "BOOKED" || b.status === "ACTIVE") &&
    (b.date > todayDate || (b.date === todayDate && b.endTime > currentTime))
  );

  const handleBook = async () => {
    if (!selectedSlot) return toast.warning("Please select an available time slot");
    try {
      setLoading(true);
      const res = await createLaundryBooking({
        machineId: showBookingModal._id,
        date: selectedDate,
        slot: selectedSlot
      });
      if (res.success) {
        toast.success(`Booking Confirmed! ID: ${res.booking.bookingId}`);
        setShowBookingModal(null);
        setSelectedSlot("");
        fetchData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  const handleReport = async (e) => {
    e.preventDefault();
    try {
      await reportMachineProblem({
        machineId: showReportModal._id,
        ...reportData
      });
      toast.success("Problem reported to maintenance");
      setShowReportModal(null);
      setReportData({ issueType: "Machine not starting", description: "" });
    } catch (error) {
      toast.error("Failed to submit report");
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />

        <div className="laundry-container">
          <h1 className="dashboard-title">Washing Machine Booking</h1>

          {/* Current Booking Alert */}
          {activeBooking && (
            <div className="mess-status-card" style={{ borderLeft: '6px solid #22c55e', marginBottom: '25px' }}>
              <div className="status-info">
                <h2>Your Current Active Booking</h2>
                <p>Machine {activeBooking.machine?.machineNumber} • {activeBooking.date} • {activeBooking.startTime}-{activeBooking.endTime}</p>
              </div>
              <div className="status-badge open">
                {activeBooking.status}
              </div>
            </div>
          )}

          {/* Summary Stats */}
          <div className="laundry-summary">
            <div className="summary-box">
              <h4>Total</h4>
              <p>{machines.length}</p>
            </div>
            <div className="summary-box">
              <h4>Available</h4>
              <p>{machines.filter(m => m.status === 'FREE').length}</p>
            </div>
            <div className="summary-box">
              <h4>In Use Now</h4>
              <p>{machines.filter(m => m.status === 'IN_USE').length}</p>
            </div>
            <div className="summary-box">
              <h4>Maintenance</h4>
              <p>{machines.filter(m => m.status === 'UNDER_SERVICE' || m.status === 'OUT_OF_SERVICE').length}</p>
            </div>
          </div>

          <div className="machine-grid">
            {machines.map((machine) => {
              const isAvailable = machine.status !== 'UNDER_SERVICE' && machine.status !== 'OUT_OF_SERVICE';

              return (
                <div key={machine._id} className="machine-card">
                  <div className="machine-header">
                    <div className="machine-info">
                      <h3>Machine {machine.machineNumber}</h3>
                      <span>{machine.block} • Floor {machine.floor}</span>
                    </div>
                    <span className={`machine-status status-${machine.status}`}>
                      {machine.status === 'IN_USE' ? 'IN USE NOW' : machine.status}
                    </span>
                  </div>

                  <div className="machine-body" style={{ textAlign: 'center', padding: '10px 0' }}>
                     <FaTshirt style={{ fontSize: '48px', color: isAvailable ? '#22c55e' : '#64748b', opacity: 0.8 }} />
                  </div>

                  <button
                    className="machine-action-btn"
                    disabled={!isAvailable || !!activeBooking}
                    onClick={() => {
                      setShowBookingModal(machine);
                      setSelectedSlot("");
                      setSelectedDate(todayDate);
                    }}
                  >
                    {!isAvailable ? machine.status.replace('_', ' ') : activeBooking ? "1 Booking Allowed" : "BOOK NOW"}
                  </button>

                  <p className="report-link" onClick={() => setShowReportModal(machine)}>
                    Report a problem
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Booking Modal */}
        {showBookingModal && (
          <div className="booking-modal">
            <div className="modal-content">
              <button className="close-modal" onClick={() => setShowBookingModal(null)}>✕</button>
              <h2>Book Machine {showBookingModal.machineNumber}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Select date and an open time slot.</p>

              <div style={{ marginTop: '15px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '5px' }}>Date (Within 24 Hours)</label>
                <input
                  type="date"
                  className="edit-items-area"
                  style={{ minHeight: 'auto', marginBottom: '15px', width: '100%' }}
                  value={selectedDate}
                  min={todayDate}
                  max={tomorrowDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setSelectedSlot("");
                  }}
                />
              </div>

              <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>Available Slots</label>
              <div className="slot-grid">
                {settings?.availableSlots.map(slot => {
                  const [slotStart, slotEnd] = slot.split("-");
                  const isAlreadyBooked = bookedSlots.includes(slot);
                  const isPassed = (selectedDate === todayDate && slotEnd <= currentTime);
                  const isDisabled = isAlreadyBooked || isPassed;

                  return (
                    <button
                      key={slot}
                      type="button"
                      className={`slot-btn ${selectedSlot === slot ? 'selected' : ''} ${isDisabled ? 'disabled-slot' : ''}`}
                      disabled={isDisabled}
                      onClick={() => setSelectedSlot(slot)}
                    >
                      {slot}
                      {isAlreadyBooked ? " (Booked)" : isPassed ? " (Passed)" : ""}
                    </button>
                  );
                })}
              </div>

              <button className="confirm-booking-btn" onClick={handleBook} disabled={loading || !selectedSlot}>
                {loading ? "Confirming..." : "CONFIRM BOOKING"}
              </button>
            </div>
          </div>
        )}

        {/* Report Modal */}
        {showReportModal && (
          <div className="booking-modal">
            <div className="modal-content">
              <button className="close-modal" onClick={() => setShowReportModal(null)}>✕</button>
              <h2>Report Issue</h2>
              <p>Washing Machine {showReportModal.machineNumber}</p>

              <form onSubmit={handleReport} style={{ marginTop: '20px' }}>
                <label>Issue Type</label>
                <select
                  className="edit-items-area"
                  style={{ minHeight: 'auto' }}
                  value={reportData.issueType}
                  onChange={(e) => setReportData({...reportData, issueType: e.target.value})}
                >
                  <option>Machine not starting</option>
                  <option>Door problem</option>
                  <option>Water leakage</option>
                  <option>Excessive vibration</option>
                  <option>Electrical problem</option>
                  <option>Other</option>
                </select>

                <label style={{ marginTop: '15px', display: 'block' }}>Description</label>
                <textarea
                  className="edit-items-area"
                  placeholder="Tell us what's wrong..."
                  value={reportData.description}
                  onChange={(e) => setReportData({...reportData, description: e.target.value})}
                  required
                />

                <button type="submit" className="confirm-booking-btn" style={{ background: '#ef4444' }}>
                  Submit Report
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Laundry;
