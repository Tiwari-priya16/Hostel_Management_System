import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";

import {
  getAllVisitors,
  approveVisitor,
  rejectVisitor,
} from "../../services/visitorService";
import { toast } from "react-toastify";

import "../complaint/ComplaintList.css";
import "../dashboard/dashboard.css";

function AdminVisitors() {
  const [visitors, setVisitors] =
    useState([]);

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      const res =
        await getAllVisitors();

      setVisitors(
        res.visitors || []
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleApprove = async (
    id
  ) => {
    try {
      setVisitors(prev => prev.map(item => item._id === id ? { ...item, status: "Approved" } : item));
      await approveVisitor(id);
      toast.success("Visitor Approved");
    } catch (err) {
      toast.error("Failed to approve");
      fetchVisitors();
    }
  };

  const handleReject = async (
    id
  ) => {
    try {
      setVisitors(prev => prev.map(item => item._id === id ? { ...item, status: "Rejected" } : item));
      await rejectVisitor(id);
      toast.success("Visitor Rejected");
    } catch (err) {
      toast.error("Failed to reject");
      fetchVisitors();
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="content">
        <Navbar />

        <div className="complaint-list-container">
          <h1>Manage Visitors</h1>

          <table className="complaint-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Visitor</th>
                <th>Phone</th>
                <th>Relation</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {visitors.map(
                (item) => (
                  <tr key={item._id}>
                    <td>
                      <div>
                        <strong>
                          {
                            item.student
                              ?.name
                          }
                        </strong>

                        <br />

                        <small>
                          {
                            item.student
                              ?.email
                          }
                        </small>

                        <br />

                        <small>
                          Room:{" "}
                          {item
                            .student
                            ?.roomNumber ||
                            "N/A"}
                        </small>
                      </div>
                    </td>

                    <td>
                      {
                        item.visitorName
                      }
                    </td>

                    <td>
                      {item.phone}
                    </td>

                    <td>
                      {
                        item.relation
                      }
                    </td>

                    <td>
                      {new Date(
                        item.visitDate
                      ).toLocaleDateString(
                        "en-IN"
                      )}
                    </td>

                    <td>
                      <span
                        className={`status ${item.status
                          .replace(
                            /\s/g,
                            ""
                          )
                          .toLowerCase()}`}
                      >
                        {
                          item.status
                        }
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
                        "Action Taken"
                      )}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>

          {visitors.length ===
            0 && (
            <p>
              No visitor requests
              found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminVisitors;