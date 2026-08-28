import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import {
  getMachines,
  addMachine,
  updateMachine,
  getAllLaundryBookings,
  getMaintenanceRequests,
  resolveMaintenanceRequest,
  getLaundrySettings,
  updateLaundrySettings,
  cancelLaundryBooking
} from "../../services/laundryService";
import { toast } from "react-toastify";
import { FaTshirt, FaTools, FaCalendarAlt, FaCog, FaPlus, FaEdit, FaTrash, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import "./AdminLaundry.css";

function AdminLaundry() {
  const [activeTab, setActiveTab] = useState("machines"); // machines, bookings, maintenance, settings
  const [machines, setMachines] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [settings, setSettings] = useState({
    bookingDurationMinutes: 60,
    advanceBookingDays: 2,
    maxActiveBookingsPerStudent: 1,
    cancellationMinutesBeforeStart: 15,
    noShowGraceMinutes: 10,
    operatingStartTime: "07:00",
    operatingEndTime: "23:00",
    availableSlots: []
  });
  const [loading, setLoading] = useState(false);

  // Modal States
  const [showMachineModal, setShowMachineModal] = useState(null); // 'add' or machine object for edit
  const [machineForm, setMachineForm] = useState({ machineNumber: "", name: "", block: "", floor: "", location: "", status: "FREE" });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === "machines") {
        const res = await getMachines();
        setMachines(res.machines);
      } else if (activeTab === "bookings") {
        const res = await getAllLaundryBookings();
        setBookings(res.bookings);
      } else if (activeTab === "maintenance") {
        const res = await getMaintenanceRequests();
        setMaintenance(res.requests);
      } else if (activeTab === "settings") {
        const res = await getLaundrySettings();
        setSettings(res.settings);
      }
    } catch (error) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleMachineSubmit = async (e) => {
    e.preventDefault();
    try {
      if (showMachineModal === 'add') {
        await addMachine(machineForm);
        toast.success("Machine added successfully");
      } else {
        await updateMachine(showMachineModal._id, machineForm);
        toast.success("Machine updated successfully");
      }
      setShowMachineModal(null);
      setMachineForm({ machineNumber: "", name: "", block: "", floor: "", location: "", status: "FREE" });
      fetchData();
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  const handleStatusToggle = async (machine, newStatus) => {
    try {
      await updateMachine(machine._id, { status: newStatus });
      toast.success(`Machine ${machine.machineNumber} is now ${newStatus}`);
      fetchData();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleSettingsSave = async (e) => {
    e.preventDefault();
    try {
      await updateLaundrySettings(settings);
      toast.success("Settings updated");
    } catch (error) {
      toast.error("Failed to update settings");
    }
  };

  const handleResolve = async (id) => {
    try {
      await resolveMaintenanceRequest(id);
      toast.success("Issue resolved and machine freed!");
      fetchData();
    } catch (error) {
      toast.error("Failed to resolve issue");
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />

        <div className="admin-laundry-container">
          <div className="admin-header">
            <h1 className="dashboard-title">Laundry Management</h1>
            <div className="tab-switcher">
              <button className={activeTab === 'machines' ? 'active' : ''} onClick={() => setActiveTab('machines')}><FaTshirt /> Machines</button>
              <button className={activeTab === 'bookings' ? 'active' : ''} onClick={() => setActiveTab('bookings')}><FaCalendarAlt /> All Bookings</button>
              <button className={activeTab === 'maintenance' ? 'active' : ''} onClick={() => setActiveTab('maintenance')}><FaTools /> Maintenance</button>
              <button className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}><FaCog /> Settings</button>
            </div>
          </div>

          <div className="admin-content-body">
            {activeTab === 'machines' && (
              <div className="machines-panel">
                <div className="panel-header">
                  <h3>Managed Washing Machines ({machines.length})</h3>
                  <button className="add-btn" onClick={() => { setShowMachineModal('add'); setMachineForm({ machineNumber: "", name: "", block: "", floor: "", location: "", status: "FREE" }); }}>
                    <FaPlus /> Add Machine
                  </button>
                </div>
                <div className="admin-machine-grid">
                  {machines.map(m => (
                    <div key={m._id} className={`admin-machine-card status-${m.status}`}>
                      <div className="m-card-header">
                        <h4>Machine {m.machineNumber}</h4>
                        <span className="m-status-pill">{m.status}</span>
                      </div>
                      <div className="m-card-details">
                        <p>{m.name}</p>
                        <small>{m.block} • Floor {m.floor}</small>
                      </div>
                      <div className="m-card-actions">
                        <button title="Edit" onClick={() => { setShowMachineModal(m); setMachineForm(m); }}><FaEdit /></button>
                        {m.status === 'FREE' ? (
                          <button title="Put Under Service" className="warn" onClick={() => handleStatusToggle(m, 'UNDER_SERVICE')}><FaTools /></button>
                        ) : m.status === 'UNDER_SERVICE' ? (
                          <button title="Restore to Free" className="success" onClick={() => handleStatusToggle(m, 'FREE')}><FaCheckCircle /></button>
                        ) : null}
                        <button title="Mark Out of Service" className="danger" onClick={() => handleStatusToggle(m, 'OUT_OF_SERVICE')}><FaExclamationCircle /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'bookings' && (
              <div className="bookings-panel">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Student</th>
                      <th>Room</th>
                      <th>Machine</th>
                      <th>Date / Time</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(b => (
                      <tr key={b._id}>
                        <td><strong>{b.bookingId}</strong></td>
                        <td>{b.student?.name}</td>
                        <td>{b.student?.roomNumber}</td>
                        <td>#{b.machine?.machineNumber}</td>
                        <td>{b.date}<br/><small>{b.startTime}-{b.endTime}</small></td>
                        <td><span className={`status-pill ${b.status}`}>{b.status}</span></td>
                        <td>
                          {b.status === 'BOOKED' && (
                            <button className="table-action-btn danger" onClick={() => cancelLaundryBooking(b._id)}>Cancel</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'maintenance' && (
              <div className="maintenance-panel">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Machine</th>
                      <th>Issue</th>
                      <th>Reported By</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {maintenance.map(r => (
                      <tr key={r._id}>
                        <td>Machine {r.machine?.machineNumber}</td>
                        <td><strong>{r.issueType}</strong><br/><small>{r.description}</small></td>
                        <td>{r.reportedBy?.name} (Room {r.reportedBy?.roomNumber})</td>
                        <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                        <td><span className={`status-pill ${r.status}`}>{r.status}</span></td>
                        <td>
                          {r.status !== 'RESOLVED' && (
                            <button className="table-action-btn success" onClick={() => handleResolve(r._id)}>Resolve</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="settings-panel">
                <form className="settings-form" onSubmit={handleSettingsSave}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Max Advance Booking (Days)</label>
                      <input type="number" value={settings.advanceBookingDays} onChange={e => setSettings({...settings, advanceBookingDays: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label>Max Active Bookings Per Student</label>
                      <input type="number" value={settings.maxActiveBookingsPerStudent} onChange={e => setSettings({...settings, maxActiveBookingsPerStudent: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label>Cancellation Deadline (Minutes Before)</label>
                      <input type="number" value={settings.cancellationMinutesBeforeStart} onChange={e => setSettings({...settings, cancellationMinutesBeforeStart: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label>No-Show Grace Period (Minutes)</label>
                      <input type="number" value={settings.noShowGraceMinutes} onChange={e => setSettings({...settings, noShowGraceMinutes: e.target.value})} />
                    </div>
                  </div>
                  <button type="submit" className="save-settings-btn">Save Laundry Rules</button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Machine Add/Edit Modal */}
        {showMachineModal && (
          <div className="admin-modal">
            <div className="modal-content">
              <h3>{showMachineModal === 'add' ? 'Add New Machine' : 'Edit Machine ' + showMachineModal.machineNumber}</h3>
              <form onSubmit={handleMachineSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Machine Number</label>
                    <input type="text" required value={machineForm.machineNumber} onChange={e => setMachineForm({...machineForm, machineNumber: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Display Name</label>
                    <input type="text" required value={machineForm.name} onChange={e => setMachineForm({...machineForm, name: e.target.value})} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Block</label>
                    <input type="text" required value={machineForm.block} onChange={e => setMachineForm({...machineForm, block: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Floor</label>
                    <input type="text" required value={machineForm.floor} onChange={e => setMachineForm({...machineForm, floor: e.target.value})} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Initial Status</label>
                  <select value={machineForm.status} onChange={e => setMachineForm({...machineForm, status: e.target.value})}>
                    <option value="FREE">FREE (Available)</option>
                    <option value="UNDER_SERVICE">UNDER SERVICE (Maintenance)</option>
                    <option value="OUT_OF_SERVICE">OUT OF SERVICE (Broken)</option>
                  </select>
                </div>
                <div className="modal-actions">
                  <button type="button" className="cancel-btn" onClick={() => setShowMachineModal(null)}>Cancel</button>
                  <button type="submit" className="confirm-btn">Save Machine</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminLaundry;
