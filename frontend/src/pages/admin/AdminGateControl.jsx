import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { getGateAdminStats, getAllGateHistory } from "../../services/gateService";
import { toast } from "react-toastify";
import { FaUsers, FaWalking, FaHistory, FaFilter, FaSearch } from "react-icons/fa";
import "./AdminGateControl.css";

function AdminGateControl() {
  const [stats, setStats] = useState({ totalInside: 0, totalOutside: 0 });
  const [outsideStudents, setOutsideStudents] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("active"); // active, history

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const statsRes = await getGateAdminStats();
      setStats(statsRes.stats);
      setOutsideStudents(statsRes.outsideStudents);

      const historyRes = await getAllGateHistory();
      setHistory(historyRes.history);
    } catch (error) {
      toast.error("Failed to load gate data");
    } finally {
      setLoading(false);
    }
  };

  const filteredOutside = outsideStudents.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.roomNumber.includes(searchTerm)
  );

  const filteredHistory = history.filter(h =>
    h.student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.student?.roomNumber.includes(searchTerm)
  );

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />

        <div className="admin-gate-container">
          <h1 className="dashboard-title">Student Movement Tracking</h1>

          <div className="gate-stats-row">
            <div className="gate-stat-card inside">
              <div className="stat-icon"><FaUsers /></div>
              <div className="stat-info">
                <h3>Students Inside</h3>
                <h2>{stats.totalInside}</h2>
              </div>
            </div>
            <div className="gate-stat-card outside">
              <div className="stat-icon"><FaWalking /></div>
              <div className="stat-info">
                <h3>Students Outside</h3>
                <h2>{stats.totalOutside}</h2>
              </div>
            </div>
          </div>

          <div className="gate-management-panel">
            <div className="panel-header">
              <div className="tab-switcher">
                <button className={activeTab === 'active' ? 'active' : ''} onClick={() => setActiveTab('active')}>Currently Outside</button>
                <button className={activeTab === 'history' ? 'active' : ''} onClick={() => setActiveTab('history')}>Full History</button>
              </div>

              <div className="search-box">
                <FaSearch />
                <input
                  type="text"
                  placeholder="Search by name or room..."
                  value={searchTerm}
                  onChange={(e) => setSearchSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="panel-body">
              {activeTab === 'active' ? (
                <div className="admin-table-container">
                  <table className="gate-admin-table">
                    <thead>
                      <tr>
                        <th>Student Name</th>
                        <th>Room</th>
                        <th>Exit Time</th>
                        <th>Reason</th>
                        <th>Phone</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOutside.length === 0 ? (
                        <tr><td colSpan="5" className="empty-cell">No students are currently outside</td></tr>
                      ) : (
                        filteredOutside.map((s, i) => (
                          <tr key={i}>
                            <td><strong>{s.name}</strong></td>
                            <td>{s.roomNumber} ({s.hostelBlock})</td>
                            <td>{new Date(s.exitTime).toLocaleString()}</td>
                            <td><span className="reason-tag">{s.reason}</span></td>
                            <td>{s.phone}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="admin-table-container">
                  <table className="gate-admin-table">
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>Room</th>
                        <th>Exit Details</th>
                        <th>Entry Time</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredHistory.length === 0 ? (
                        <tr><td colSpan="5" className="empty-cell">No history records found</td></tr>
                      ) : (
                        filteredHistory.map((h) => (
                          <tr key={h._id}>
                            <td><strong>{h.student?.name}</strong></td>
                            <td>{h.student?.roomNumber}</td>
                            <td>
                              <small>{new Date(h.exitTime).toLocaleString()}</small><br/>
                              <span className="reason-tag-small">{h.reason}</span>
                            </td>
                            <td>{h.entryTime ? new Date(h.entryTime).toLocaleString() : '---'}</td>
                            <td>
                              <span className={`status-pill ${h.status.toLowerCase()}`}>
                                {h.status === 'OUT' ? 'STILL OUT' : 'RETURNED'}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminGateControl;
