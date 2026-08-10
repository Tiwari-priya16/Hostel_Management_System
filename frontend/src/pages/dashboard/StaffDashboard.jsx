import React, {
  useEffect,
  useState,
} from "react";

import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";

import {
  getAssignedComplaints,
  updateComplaintStatus,
} from "../../services/complaintService";

import "./dashboard.css";

function StaffDashboard() {
  const [complaints, setComplaints] =
    useState([]);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints =
    async () => {
      try {
        const res =
          await getAssignedComplaints();

        setComplaints(
          res.data.complaints
        );
      } catch (error) {
        console.log(error);
      }
    };

  const updateStatus =
    async (id, status) => {
      await updateComplaintStatus(
        id,
        status
      );

      fetchComplaints();
    };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="content">
        <Navbar />

        <h1>Staff Dashboard</h1>

        <table className="complaint-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Room</th>
              <th>Title</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {complaints.map((c) => (
              <tr key={c._id}>
                <td>
                  {c.raisedBy?.name}
                </td>

                <td>
                  {c.raisedBy?.roomNumber}
                </td>

                <td>{c.title}</td>

                <td>
                  <select
                    value={c.status}
                    onChange={(e) =>
                      updateStatus(
                        c._id,
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
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}

export default StaffDashboard;