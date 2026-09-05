import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { getMyLeaves } from "../../services/leaveService";

import "./LeaveHistory.css";
import "../dashboard/dashboard.css";

function LeaveHistory() {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const res = await getMyLeaves();

      console.log("Leaves Response:", res.data);

      setLeaves(res.data.leaves || []);
    } catch (error) {
      console.log("Leave Error:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="content">
        <Navbar />

        <div className="leave-history-container">
          <h1>My Leaves</h1>

          {leaves.length === 0 ? (
            <p>No leave requests found.</p>
          ) : (
            <div className="table-responsive">
              <table className="leave-table">
                <thead>
                  <tr>
                    <th>Reason</th>
                    <th>From Date</th>
                    <th>To Date</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {leaves.map((item) => (
                    <tr key={item._id}>
                      <td>{item.reason}</td>

                      <td>
                        {new Date(
                          item.fromDate
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </td>

                      <td>
                        {new Date(
                          item.toDate
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </td>

                      <td>
                        <span
                          className={`status ${item.status.toLowerCase()}`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LeaveHistory;