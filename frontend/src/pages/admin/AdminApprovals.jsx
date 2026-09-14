import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/sidebar";
import Navbar from "../../components/navbar/Navbar";
import { getPendingApprovals, approveUser, rejectUser } from "../../services/authService";
import { toast } from "react-toastify";
import ConfirmModal from "../../components/ConfirmModal";
import Loader from "../../components/Loader";
import "../dashboard/dashboard.css";
import "../complaint/ComplaintList.css";

function AdminApprovals() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalConfig, setModalConfig] = useState({ isOpen: false });

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      const res = await getPendingApprovals();
      if (res.data.success) {
        setPendingUsers(res.data.users);
      }
    } catch (error) {
      toast.error("Failed to load pending requests");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (user) => {
    setModalConfig({
      isOpen: true,
      title: "Approve User",
      message: `Are you sure you want to approve ${user.name} as ${user.role}?`,
      confirmText: "Approve",
      type: "info",
      onConfirm: async () => {
        try {
          await approveUser(user._id);
          toast.success("User approved successfully");
          fetchPendingUsers();
        } catch (error) {
          toast.error("Approval failed");
        }
        setModalConfig({ isOpen: false });
      },
      onCancel: () => setModalConfig({ isOpen: false })
    });
  };

  const handleReject = (user) => {
    setModalConfig({
      isOpen: true,
      title: "Reject User",
      message: `Are you sure you want to reject registration request from ${user.name}?`,
      confirmText: "Reject",
      type: "danger",
      onConfirm: async () => {
        try {
          await rejectUser(user._id);
          toast.success("User request rejected");
          fetchPendingUsers();
        } catch (error) {
          toast.error("Rejection failed");
        }
        setModalConfig({ isOpen: false });
      },
      onCancel: () => setModalConfig({ isOpen: false })
    });
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="content">
        <Navbar />
        <div className="complaint-list-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h1 className="welcome-text" style={{ margin: 0 }}>Pending Approvals</h1>
            <div style={{ background: '#f59e0b', color: 'white', padding: '5px 15px', borderRadius: '20px', fontWeight: 'bold' }}>
              {pendingUsers.length} Requests
            </div>
          </div>

          {loading ? (
            <Loader />
          ) : pendingUsers.length === 0 ? (
            <div className="card" style={{ flexDirection: 'column', textAlign: 'center', padding: '60px' }}>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--text-secondary)' }}>No pending registration requests</h3>
              <p>Warden and Staff requests requiring approval will appear here.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="complaint-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Block</th>
                    <th>Applied On</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingUsers.map((user) => (
                    <tr key={user._id}>
                      <td><strong>{user.name}</strong></td>
                      <td>{user.email}</td>
                      <td>
                        <span className="status inprogress" style={{ textTransform: 'capitalize' }}>
                          {user.role}
                        </span>
                      </td>
                      <td>{user.hostelBlock}</td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="complaint-action">
                          <button
                            className="approve-btn"
                            onClick={() => handleApprove(user)}
                          >
                            Approve
                          </button>
                          <button
                            className="reject-btn"
                            onClick={() => handleReject(user)}
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <ConfirmModal {...modalConfig} />
    </div>
  );
}

export default AdminApprovals;
