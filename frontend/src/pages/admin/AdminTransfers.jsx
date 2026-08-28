import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { toast } from "react-toastify";

import {
  getAllTransfers,
  approveTransfer,
  rejectTransfer,
} from "../../services/roomTransferService";

import "../complaint/ComplaintList.css";
import "../dashboard/dashboard.css";

function AdminTransfers() {
  const [transfers, setTransfers] = useState([]);

  useEffect(() => {
    fetchTransfers();
  }, []);

  const fetchTransfers = async () => {
    try {
      const res = await getAllTransfers();

      setTransfers(res.transfers || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleApprove = async (id) => {
    try {
      setTransfers(prev => prev.map(item => item._id === id ? { ...item, status: "Approved" } : item));
      await approveTransfer(id);
      toast.success("Transfer approved");
    } catch (error) {
      toast.error("Failed to approve");
      fetchTransfers();
    }
  };

  const handleReject = async (id) => {
    try {
      setTransfers(prev => prev.map(item => item._id === id ? { ...item, status: "Rejected" } : item));
      await rejectTransfer(id);
      toast.success("Transfer rejected");
    } catch (error) {
      toast.error("Failed to reject");
      fetchTransfers();
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="content">
        <Navbar />

        <div className="complaint-list-container">
          <h1>Room Transfer Requests</h1>

          <table className="complaint-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Current Room</th>
                <th>Requested Room</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {transfers.map((transfer) => (
                <tr key={transfer._id}>
                  <td>
                    <strong>
                      {transfer.student?.name}
                    </strong>
                    <br />
                    {transfer.student?.email}
                  </td>

                  <td>{transfer.currentRoom}</td>

                  <td>{transfer.requestedRoom}</td>

                  <td>{transfer.reason}</td>

                  <td>
                    <span
                      className={`status ${transfer.status?.toLowerCase()}`}
                    >
                      {transfer.status}
                    </span>
                  </td>

                  <td>
                    {transfer.status === "Pending" ? (
                      <>
                        <button
                          onClick={() =>
                            handleApprove(
                              transfer._id
                            )
                          }
                          style={{
                            marginRight: "10px",
                          }}
                        >
                          Approve
                        </button>

                        <button
                          onClick={() =>
                            handleReject(
                              transfer._id
                            )
                          }
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {transfers.length === 0 && (
            <p>
              No room transfer requests
              found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminTransfers;