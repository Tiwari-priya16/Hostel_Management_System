import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";

import {
  getAllComplaints,
  updateComplaintStatus,
  deleteComplaint,
} from "../../services/complaintService";

import "../complaint/ComplaintList.css";
import "../dashboard/dashboard.css";

function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);

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

  const handleStatusChange = async (id, status) => {
    try {
      await updateComplaintStatus(id, status);
      fetchComplaints();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this complaint?"
    );

    if (!confirmDelete) return;

    try {
      await deleteComplaint(id);
      fetchComplaints();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="content">
        <Navbar />

        <div className="complaint-list-container">
          <h1>Manage Complaints</h1>

          <table className="complaint-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {complaints.map((item) => (
                <tr key={item._id}>

                <td>
                <div>
                    <strong>
                    {item.raisedBy?.name || "N/A"}
                    </strong>

                    <br />

                    <small>
                    {item.raisedBy?.email}
                    </small>

                    <br />

                    <small>
                    Room:{" "}
                    {item.roomNumber ||
                        item.raisedBy?.roomNumber ||
                        "N/A"}
                    </small>
                </div>
                </td>

                  <td>{item.title}</td>

                  <td>{item.category}</td>

                  <td>
                    <span
                      className={`status ${item.status
                        .replace(/\s/g, "")
                        .toLowerCase()}`}
                    >
                      {item.status}
                    </span>
                  </td>

                    <td>
                    <div className="complaint-action">
                        <select
                        className="status-select"
                        value={item.status}
                        onChange={(e) =>
                            handleStatusChange(
                            item._id,
                            e.target.value
                            )
                        }
                        >
                        <option value="Pending">
                            Pending
                        </option>

                        <option value="In Progress">
                            In Progress
                        </option>

                        <option value="Resolved">
                            Resolved
                        </option>

                        <option value="Rejected">
                            Rejected
                        </option>
                        </select>

                        {item.status === "Resolved" && (
                        <button
                            className="delete-btn"
                            onClick={() =>
                            handleDelete(item._id)
                            }
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

          {complaints.length === 0 && (
            <p>No complaints found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminComplaints;