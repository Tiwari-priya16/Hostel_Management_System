import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { recordExit, recordEntry, getMyGateHistory } from "../../services/gateService";
import { toast } from "react-toastify";
import { FaSignOutAlt, FaSignInAlt, FaHistory, FaClock, FaMapMarkerAlt } from "react-icons/fa";
import "./EntryExit.css";

function EntryExit() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [reason, setReason] = useState("College");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await getMyGateHistory();
      setHistory(res.history);
    } catch (error) {
      console.error(error);
    }
  };

  const handleExit = async () => {
    try {
      setLoading(true);
      const res = await recordExit({ reason });
      if (res.success) {
        toast.success("Exit recorded! Stay safe.");
        updateLocalStatus("Outside Hostel");
        setShowExitModal(false);
        fetchHistory();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to record exit");
    } finally {
      setLoading(false);
    }
  };

  const handleEntry = async () => {
    try {
      setLoading(true);
      const res = await recordEntry();
      if (res.success) {
        toast.success("Welcome back!");
        updateLocalStatus("Inside Hostel");
        fetchHistory();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to record entry");
    } finally {
      setLoading(false);
    }
  };

  const updateLocalStatus = (newStatus) => {
    const updatedUser = { ...user, currentStatus: newStatus };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const isOutside = user.currentStatus === "Outside Hostel";

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />

        <div className="gate-container">
          <h1 className="dashboard-title">Entry / Exit Management</h1>

          <div className="gate-status-card">
            <div className="status-main">
              <div className={`status-indicator ${isOutside ? 'outside' : 'inside'}`}></div>
              <div>
                <h2>You are currently <span className={isOutside ? 'text-outside' : 'text-inside'}>{user.currentStatus}</span></h2>
                <p>{isOutside ? "Remember to mark your entry when you return." : "Don't forget to mark your exit before leaving."}</p>
              </div>
            </div>

            <button
              className={`gate-btn ${isOutside ? 'entry-btn' : 'exit-btn'}`}
              onClick={isOutside ? handleEntry : () => setShowExitModal(true)}
              disabled={loading}
            >
              {loading ? "Processing..." : isOutside ? <><FaSignInAlt /> Enter Hostel</> : <><FaSignOutAlt /> Exit Hostel</>}
            </button>
          </div>

          <div className="history-section">
            <div className="section-header">
              <h3><FaHistory /> Recent Movements</h3>
            </div>

            <div className="gate-history-list">
              {history.length === 0 ? (
                <p className="no-data">No history found</p>
              ) : (
                history.map((item) => (
                  <div key={item._id} className="gate-history-card">
                    <div className="history-main">
                      <div className="history-icon">
                        {item.status === 'IN' ? <FaSignInAlt className="in" /> : <FaSignOutAlt className="out" />}
                      </div>
                      <div className="history-info">
                        <h4>{item.reason}</h4>
                        <div className="history-times">
                          <span><FaClock /> Out: {new Date(item.exitTime).toLocaleString()}</span>
                          {item.entryTime && <span><FaClock /> In: {new Date(item.entryTime).toLocaleString()}</span>}
                        </div>
                      </div>
                    </div>
                    <div className={`history-status-badge ${item.status.toLowerCase()}`}>
                      {item.status === 'OUT' ? 'STILL OUTSIDE' : 'RETURNED'}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {showExitModal && (
          <div className="gate-modal">
            <div className="modal-content">
              <h3>Exit Registration</h3>
              <p>Please select your reason for leaving the hostel.</p>

              <div className="form-group">
                <label>Reason for Leaving</label>
                <select value={reason} onChange={(e) => setReason(e.target.value)} className="gate-select">
                  <option value="College">College</option>
                  <option value="Home">Home</option>
                  <option value="Market">Market</option>
                  <option value="Medical">Medical</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="modal-actions">
                <button className="cancel-btn" onClick={() => setShowExitModal(false)}>Cancel</button>
                <button className="confirm-btn" onClick={handleExit} disabled={loading}>Confirm Exit</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EntryExit;
