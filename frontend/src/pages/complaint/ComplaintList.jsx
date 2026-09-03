import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { getMyComplaints } from "../../services/complaintService";
import { FaImage, FaCheckCircle, FaTimes } from "react-icons/fa";

import "./ComplaintList.css";
import "../dashboard/dashboard.css";

function ComplaintList() {
  const [complaints, setComplaints] = useState([]);
  const [activePhotoModal, setActivePhotoModal] = useState(null); // { url, title }

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await getMyComplaints();
      setComplaints(res.data.complaints);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="content">
        <Navbar />

        <div className="complaint-list-container">
          <h1>My Complaints</h1>

          <div style={{ overflowX: "auto" }}>
            <table className="complaint-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Evidence Photo</th>
                  <th>Status</th>
                  <th>Resolution Photo</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {complaints.map((item) => (
                  <tr key={item._id}>
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
                          title="Click to view full photo"
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
                          title="Click to view resolution proof"
                        >
                          <img src={item.resolutionPhoto} alt="Resolution" />
                        </div>
                      ) : item.status === "Resolved" ? (
                        <span className="no-photo-badge"><FaCheckCircle style={{ color: "#22c55e" }} /> Fixed</span>
                      ) : (
                        <span className="no-photo-badge">Pending</span>
                      )}
                    </td>

                    <td>
                      {new Date(item.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {complaints.length === 0 && <p style={{ textAlign: "center", marginTop: "20px" }}>No complaints found.</p>}
        </div>

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

export default ComplaintList;
