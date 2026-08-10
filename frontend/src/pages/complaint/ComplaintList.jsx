import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { getMyComplaints } from "../../services/complaintService";

import "./ComplaintList.css";
import "../dashboard/dashboard.css";

function ComplaintList() {
  const [complaints, setComplaints] = useState([]);

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

          <table className="complaint-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {complaints.map((item) => (
                <tr key={item._id}>
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
                    {new Date(item.createdAt).toLocaleDateString(
                      "en-IN",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    )}
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

export default ComplaintList;