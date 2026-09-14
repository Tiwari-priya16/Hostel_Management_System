import React, {
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/sidebar/sidebar";
import Navbar from "../../components/navbar/Navbar";
import { FaUserCheck } from "react-icons/fa";
import Loader from "../../components/Loader";

import {
  getStudents,
  getStaff,
} from "../../services/userService";

import { getPendingApprovals } from "../../services/authService";

import "../dashboard/dashboard.css";

function AdminUsers() {
  const navigate = useNavigate();

  const [studentsCount, setStudentsCount] =
    useState(0);

  const [staffCount, setStaffCount] =
    useState(0);

  const [pendingCount, setPendingCount] =
    useState(0);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      setLoading(true);
      const studentsRes =
        await getStudents();

      const staffRes =
        await getStaff();

      const pendingRes = await getPendingApprovals();

      setStudentsCount(
        studentsRes.users?.length ||
          studentsRes.students?.length ||
          0
      );

      setStaffCount(
        staffRes.users?.length ||
          staffRes.staff?.length ||
          0
      );

      setPendingCount(pendingRes.data.users?.length || 0);
    } catch (error) {
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
          <h1>
            Users Management
          </h1>

          {loading ? (
            <Loader />
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(250px,1fr))",
                gap: "20px",
                marginTop: "30px",
              }}
            >
              <div
                className="card"
                onClick={() =>
                  navigate(
                    "/admin/users/students"
                  )
                }
              >
                <h3>
                  Students Details
                </h3>

                <h2
                  style={{
                    color: "#2563eb",
                    fontSize: "40px",
                    margin: "10px 0",
                  }}
                >
                  {studentsCount}
                </h2>

                <p>
                  Total Students
                </p>
              </div>

              <div
                className="card"
                onClick={() =>
                  navigate(
                    "/admin/users/staff"
                  )
                }
              >
                <h3>
                  Staff Details
                </h3>

                <h2
                  style={{
                    color: "#2563eb",
                    fontSize: "40px",
                    margin: "10px 0",
                  }}
                >
                  {staffCount}
                </h2>

                <p>
                  Total Staff
                </p>
              </div>

              <div
                className="card"
                style={{ borderLeftColor: "#f59e0b" }}
                onClick={() =>
                  navigate(
                    "/admin/approvals"
                  )
                }
              >
                <h3>
                  Pending Approvals
                </h3>

                <h2
                  style={{
                    color: "#f59e0b",
                    fontSize: "40px",
                    margin: "10px 0",
                  }}
                >
                  {pendingCount}
                </h2>

                <p>
                  Action Required
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminUsers;