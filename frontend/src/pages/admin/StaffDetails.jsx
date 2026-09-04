import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { getStaff } from "../../services/userService";
import "../complaint/ComplaintList.css";
import "../dashboard/dashboard.css";

function StaffDetails() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await getStaff();
      setStaff(res.staff || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="content">
        <Navbar />

        <div className="complaint-list-container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h1 style={{ margin: 0 }}>Warden & Staff Roster</h1>
            <span className="no-photo-badge" style={{ fontSize: "13px", padding: "6px 14px" }}>
              Total: {staff.length} Members
            </span>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="complaint-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Assigned Block</th>
                  <th>Role</th>
                </tr>
              </thead>

              <tbody>
                {staff.map((member) => (
                  <tr key={member._id}>
                    <td>
                      <strong>{member.name}</strong>
                    </td>

                    <td>{member.email}</td>

                    <td>{member.phone || "N/A"}</td>

                    <td>
                      <span className="reason-tag" style={{ background: "rgba(37, 99, 235, 0.1)", color: "#2563eb" }}>
                        {member.hostelBlock || "All Blocks"}
                      </span>
                    </td>

                    <td>
                      <span
                        className="status"
                        style={{
                          background: member.role === "warden" ? "rgba(139, 92, 246, 0.15)" : "rgba(34, 197, 94, 0.15)",
                          color: member.role === "warden" ? "#8b5cf6" : "#22c55e",
                          border: `1px solid ${member.role === "warden" ? "rgba(139, 92, 246, 0.3)" : "rgba(34, 197, 94, 0.3)"}`
                        }}
                      >
                        {member.role === "warden" ? `Warden (${member.hostelBlock || "Hostel"})` : "Caretaker / Staff"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {staff.length === 0 && !loading && (
            <p style={{ textAlign: "center", marginTop: "20px" }}>No Wardens or Staff members registered yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default StaffDetails;
