import React, {
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";

import {
  getStudents,
  getStaff,
} from "../../services/userService";

import "../dashboard/dashboard.css";

function AdminUsers() {
  const navigate = useNavigate();

  const [studentsCount, setStudentsCount] =
    useState(0);

  const [staffCount, setStaffCount] =
    useState(0);

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      const studentsRes =
        await getStudents();

      const staffRes =
        await getStaff();

      console.log(
        "Students:",
        studentsRes
      );

      console.log(
        "Staff:",
        staffRes
      );

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
          <h1>
            Users Management
          </h1>

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
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminUsers;