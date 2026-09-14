import React, {
  useEffect,
  useState,
} from "react";

import Sidebar from "../../components/sidebar/sidebar";
import Navbar from "../../components/navbar/Navbar";
import Loader from "../../components/Loader";

import { getStudents } from "../../services/userService";

import "../complaint/ComplaintList.css";
import "../dashboard/dashboard.css";

function StudentsDetails() {
  const [students, setStudents] =
    useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents =
    async () => {
      try {
        setLoading(true);
        const res =
          await getStudents();

        setStudents(
          res.students || []
        );
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
            Students Details
          </h1>

          {loading ? (
            <Loader />
          ) : (
            <>
              <div className="table-responsive">
                <table className="complaint-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Room</th>
                      <th>Block</th>
                    </tr>
                  </thead>

                  <tbody>
                    {students.map(
                      (student) => (
                        <tr
                          key={student._id}
                        >
                          <td>
                            {student.name}
                          </td>

                          <td>
                            {student.email}
                          </td>

                          <td>
                            {student.phone ||
                              "N/A"}
                          </td>

                          <td>
                            {student.roomNumber ||
                              "N/A"}
                          </td>

                          <td>
                            {student.hostelBlock ||
                              "N/A"}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
              {students.length === 0 && <p style={{ textAlign: 'center', marginTop: '20px' }}>No students found.</p>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentsDetails;