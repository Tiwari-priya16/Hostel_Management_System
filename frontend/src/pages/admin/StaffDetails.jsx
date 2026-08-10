import React, {
  useEffect,
  useState,
} from "react";

import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";

import { getStaff } from "../../services/userService";

import "../complaint/ComplaintList.css";
import "../dashboard/dashboard.css";

function StaffDetails() {
  const [staff, setStaff] =
    useState([]);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const res =
        await getStaff();

      setStaff(
        res.staff || []
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
          <h1>Staff Details</h1>

          <table className="complaint-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
              </tr>
            </thead>

            <tbody>
              {staff.map(
                (member) => (
                  <tr
                    key={member._id}
                  >
                    <td>
                      {member.name}
                    </td>

                    <td>
                      {member.email}
                    </td>

                    <td>
                      {member.phone ||
                        "N/A"}
                    </td>

                    <td>
                      {member.role}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default StaffDetails;