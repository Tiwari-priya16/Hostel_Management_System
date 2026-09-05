import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { toast } from "react-toastify";

import {
  getAllLeaves,
  approveLeave,
  rejectLeave,
} from "../../services/leaveService";

import "../complaint/ComplaintList.css";
import "../dashboard/dashboard.css";

function AdminLeaves() {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const res = await getAllLeaves();
      setLeaves(res.data.leaves);
    } catch (err) {
      console.log(err);
    }
  };

  const handleApprove = async (id) => {
    try {
      setLeaves(prev => prev.map(item => item._id === id ? { ...item, status: "Approved" } : item));
      await approveLeave(id);
      toast.success("Leave approved");
    } catch (err) {
      toast.error("Failed to approve leave");
      fetchLeaves();
    }
  };

  const handleReject = async (id) => {
    try {
      setLeaves(prev => prev.map(item => item._id === id ? { ...item, status: "Rejected" } : item));
      await rejectLeave(id);
      toast.success("Leave rejected");
    } catch (err) {
      toast.error("Failed to reject leave");
      fetchLeaves();
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="content">
        <Navbar />

        <div className="complaint-list-container">
          <h1>Manage Leaves</h1>

          <div className="table-responsive">
            <table className="complaint-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Reason</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {leaves.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <div>
                        <strong>
                          {item.student?.name}
                        </strong>
                        <br />
                        <small>
                          {item.student?.email}
                        </small>
                        <br />
                        <small>
                          Room:{" "}
                          {item.student
                            ?.roomNumber ||
                            "N/A"}
                        </small>
                      </div>
                    </td>

                    <td>{item.reason}</td>

                    <td>
                      {new Date(
                        item.fromDate
                      ).toLocaleDateString()}
                    </td>

                    <td>
                      {new Date(
                        item.toDate
                      ).toLocaleDateString()}
                    </td>

                    <td>
                      <span
                        className={`status ${item.status.toLowerCase()}`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td>
                      {item.status ===
                      "Pending" ? (
                        <>
                          <button
                            className="approve-btn"
                            onClick={() =>
                              handleApprove(
                                item._id
                              )
                            }
                          >
                            Approve
                          </button>

                          <button
                            className="reject-btn"
                            onClick={() =>
                              handleReject(
                                item._id
                              )
                            }
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span>
                          Action Taken
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {leaves.length === 0 && (
            <p>No leave requests found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminLeaves;