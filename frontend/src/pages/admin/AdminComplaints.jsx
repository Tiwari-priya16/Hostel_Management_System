import React, { useEffect, useState, useRef } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";

import {
  getAllComplaints,
  updateComplaintStatus,
  deleteComplaint,
} from "../../services/complaintService";
import { compressAndResizeImage, uploadImageToCloudinary } from "../../services/uploadService";
import { toast } from "react-toastify";
import { FaImage, FaCamera, FaTimes, FaCheckCircle, FaSpinner } from "react-icons/fa";

import "../complaint/ComplaintList.css";
import "../dashboard/dashboard.css";

function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [activePhotoModal, setActivePhotoModal] = useState(null); // { url, title }

  // Resolution Modal State
  const [resolvingComplaint, setResolvingComplaint] = useState(null); // complaint object
  const [resolutionFile, setResolutionFile] = useState(null);
  const [resolutionPreview, setResolutionPreview] = useState(null);
  const [uploadingResolution, setUploadingResolution] = useState(false);

  const galleryInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await getAllComplaints();
      setComplaints(res.data.complaints);
    } catch (err) {
      console.log(err);
    }
  };

  const handleStatusChange = async (id, status, complaintObj) => {
    if (status === "Resolved") {
      // Open Resolution Photo Upload Modal
      setResolvingComplaint(complaintObj || complaints.find(c => c._id === id));
      setResolutionFile(null);
      setResolutionPreview(null);
      return;
    }

    try {
      // Optimistic UI update
      setComplaints(prev => prev.map(item =>
        item._id === id ? { ...item, status } : item
      ));

      await updateComplaintStatus(id, status);
      toast.success(`Status updated to ${status}`);
    } catch (err) {
      toast.error("Failed to update status");
      fetchComplaints();
    }
  };

  // Handle Resolution Photo Selection
  const handleResolutionFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      toast.info("Processing image...", { autoClose: 1500 });
      const compressedFile = await compressAndResizeImage(file);
      setResolutionFile(compressedFile);
      setResolutionPreview(URL.createObjectURL(compressedFile));
    } catch (error) {
      toast.error(error.message || "Failed to process resolution photo");
      e.target.value = "";
    }
  };

  // Confirm Resolution with or without photo
  const handleConfirmResolution = async () => {
    if (!resolvingComplaint) return;

    try {
      setUploadingResolution(true);
      let resPhotoUrl = "";

      if (resolutionFile) {
        resPhotoUrl = await uploadImageToCloudinary(resolutionFile, "HostelSync/complaints");
      }

      await updateComplaintStatus(resolvingComplaint._id, {
        status: "Resolved",
        resolutionPhoto: resPhotoUrl,
      });

      toast.success("Complaint resolved successfully!");
      setResolvingComplaint(null);
      setResolutionFile(null);
      setResolutionPreview(null);
      fetchComplaints();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to resolve complaint");
    } finally {
      setUploadingResolution(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this complaint?")) return;

    try {
      await deleteComplaint(id);
      toast.success("Complaint deleted");
      fetchComplaints();
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="content">
        <Navbar />

        {/* Hidden inputs for resolution photo */}
        <input
          type="file"
          ref={galleryInputRef}
          accept="image/png, image/jpeg, image/jpg"
          style={{ display: "none" }}
          onChange={handleResolutionFileSelect}
        />
        <input
          type="file"
          ref={cameraInputRef}
          accept="image/png, image/jpeg, image/jpg"
          capture="environment"
          style={{ display: "none" }}
          onChange={handleResolutionFileSelect}
        />

        <div className="complaint-list-container">
          <h1>Manage Complaints</h1>

          <div style={{ overflowX: "auto" }}>
            <table className="complaint-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Title & Description</th>
                  <th>Category</th>
                  <th>Evidence Photo</th>
                  <th>Status</th>
                  <th>Resolution Proof</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {complaints.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <div>
                        <strong>{item.raisedBy?.name || "N/A"}</strong>
                        <br />
                        <small>{item.raisedBy?.email}</small>
                        <br />
                        <small>
                          Room: {item.roomNumber || item.raisedBy?.roomNumber || "N/A"}
                        </small>
                      </div>
                    </td>

                    <td>
                      <strong>{item.title}</strong>
                      <br />
                      <small style={{ color: "var(--text-muted)" }}>{item.description}</small>
                    </td>

                    <td>{item.category}</td>

                    {/* Evidence Photo */}
                    <td>
                      {item.photo ? (
                        <div
                          className="table-photo-thumb"
                          onClick={() => setActivePhotoModal({ url: item.photo, title: `Evidence: ${item.title}` })}
                          title="Click to view evidence photo"
                        >
                          <img src={item.photo} alt="Evidence" />
                        </div>
                      ) : (
                        <span className="no-photo-badge">None</span>
                      )}
                    </td>

                    <td>
                      <span
                        className={`status ${item.status
                          .replace(/\s/g, "")
                          .toLowerCase()}`}
                      >
                        {item.status}
                      </span>
                    </td>

                    {/* Resolution Photo */}
                    <td>
                      {item.resolutionPhoto ? (
                        <div
                          className="table-photo-thumb resolved-thumb"
                          onClick={() => setActivePhotoModal({ url: item.resolutionPhoto, title: `Proof of Fix: ${item.title}` })}
                          title="Click to view resolution photo"
                        >
                          <img src={item.resolutionPhoto} alt="Resolution" />
                        </div>
                      ) : (
                        <span className="no-photo-badge">None</span>
                      )}
                    </td>

                    <td>
                      <div className="complaint-action">
                        <select
                          className="status-select"
                          value={item.status}
                          onChange={(e) =>
                            handleStatusChange(item._id, e.target.value, item)
                          }
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Rejected">Rejected</option>
                        </select>

                        {item.status === "Resolved" && (
                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(item._id)}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {complaints.length === 0 && <p style={{ textAlign: "center", marginTop: "20px" }}>No complaints found.</p>}
        </div>

        {/* Resolution Photo Upload Modal */}
        {resolvingComplaint && (
          <div className="photo-view-modal-overlay">
            <div className="resolution-modal-card">
              <div className="modal-header">
                <h3>Resolve Complaint</h3>
                <button className="close-view-btn" onClick={() => setResolvingComplaint(null)} disabled={uploadingResolution}>
                  <FaTimes />
                </button>
              </div>

              <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "15px" }}>
                Resolving: <strong>{resolvingComplaint.title}</strong>
              </p>

              <div className="photo-attachment-section">
                <label className="section-label">Upload Proof of Fix (Optional Resolution Photo)</label>

                {!resolutionPreview ? (
                  <div className="photo-choice-buttons">
                    <button
                      type="button"
                      className="photo-choice-btn"
                      onClick={() => galleryInputRef.current?.click()}
                    >
                      <FaImage /> Gallery
                    </button>
                    <button
                      type="button"
                      className="photo-choice-btn"
                      onClick={() => cameraInputRef.current?.click()}
                    >
                      <FaCamera /> Camera
                    </button>
                  </div>
                ) : (
                  <div className="photo-preview-wrapper">
                    <img src={resolutionPreview} alt="Proof Preview" className="complaint-preview-img" />
                    <button
                      type="button"
                      className="remove-photo-btn"
                      onClick={() => {
                        setResolutionFile(null);
                        setResolutionPreview(null);
                      }}
                    >
                      <FaTimes />
                    </button>
                  </div>
                )}
              </div>

              <div className="preview-actions" style={{ marginTop: "25px" }}>
                <button
                  className="cancel-btn"
                  onClick={() => setResolvingComplaint(null)}
                  disabled={uploadingResolution}
                  style={{ padding: "12px", borderRadius: "10px", border: "1px solid var(--border-color)", background: "transparent", color: "var(--text-secondary)", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  className="upload-confirm-btn"
                  onClick={handleConfirmResolution}
                  disabled={uploadingResolution}
                  style={{ flex: 2, padding: "12px", borderRadius: "10px", border: "none", background: "#22c55e", color: "white", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                >
                  {uploadingResolution ? (
                    <>
                      <FaSpinner className="spinner" /> Saving...
                    </>
                  ) : (
                    <>
                      <FaCheckCircle /> Mark as Resolved
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Full Image Modal Viewer */}
        {activePhotoModal && (
          <div className="photo-view-modal-overlay" onClick={() => setActivePhotoModal(null)}>
            <div className="photo-view-modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="photo-view-header">
                <h3>{activePhotoModal.title}</h3>
                <button className="close-view-btn" onClick={() => setActivePhotoModal(null)}>
                  <FaTimes />
                </button>
              </div>
              <div className="photo-view-body">
                <img src={activePhotoModal.url} alt="Full Size" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminComplaints;
