import React, {
  useEffect,
  useState,
} from "react";

import Sidebar from "../../components/sidebar/sidebar";
import Navbar from "../../components/navbar/Navbar";
import Loader from "../../components/Loader";

import "../dashboard/dashboard.css";
import "../leave/LeaveHistory.css";

import {
  getMyTransfers,
} from "../../services/roomTransferService";

function TransferHistory() {
  const [transfers, setTransfers] =
    useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransfers();
  }, []);

  const fetchTransfers = async () => {
    try {
      setLoading(true);
      const res =
        await getMyTransfers();

      setTransfers(
        res.transfers || []
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

      <div className="leave-history-container">
        <h1>My Transfer Requests</h1>

        {loading ? (
          <Loader />
        ) : transfers.length === 0 ? (
          <p>No requests found.</p>
        ) : (
          <div className="table-responsive">
            <table className="leave-table">
              <thead>
                <tr>
                  <th>Current Room</th>
                  <th>Requested Room</th>
                  <th>Reason</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {transfers.map(
                  (transfer) => (
                    <tr
                      key={transfer._id}
                    >
                      <td>
                        {
                          transfer.currentRoom
                        }
                      </td>

                      <td>
                        {
                          transfer.requestedRoom
                        }
                      </td>

                      <td>
                        {transfer.reason}
                      </td>

                      <td>
                        <span
                          className={`status ${transfer.status.toLowerCase()}`}
                        >
                          {transfer.status}
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

export default TransferHistory;