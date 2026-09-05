import React, {
  useEffect,
  useState,
} from "react";

import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";

import "../dashboard/dashboard.css";
import "../leave/LeaveHistory.css";

import {
  getMyVisitors,
} from "../../services/visitorService";

function VisitorHistory() {
  const [visitors, setVisitors] =
    useState([]);

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      const res =
        await getMyVisitors();

      setVisitors(
        res.visitors || []
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

      <div className="leave-history-container">
        <h1>My Visitors</h1>

        {visitors.length === 0 ? (
          <p>No visitor requests found.</p>
        ) : (
          <div className="table-responsive">
            <table className="leave-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Relation</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {visitors.map(
                  (visitor) => (
                    <tr key={visitor._id}>
                      <td>
                        {
                          visitor.visitorName
                        }
                      </td>

                      <td>
                        {
                          visitor.phone
                        }
                      </td>

                      <td>
                        {
                          visitor.relation
                        }
                      </td>

                      <td>
                        {new Date(
                          visitor.visitDate
                        ).toLocaleDateString(
                          "en-IN"
                        )}
                      </td>

                      <td>
                        <span
                          className={`status ${visitor.status.toLowerCase()}`}
                        >
                          {visitor.status}
                        </span>
                      </td>

                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  </div>
);
}

export default VisitorHistory;