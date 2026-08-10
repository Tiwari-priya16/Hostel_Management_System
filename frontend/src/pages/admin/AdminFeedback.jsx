import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";

import {
  getAllFeedback,
  getFeedbackAnalytics,
} from "../../services/feedbackService";

import "../complaint/ComplaintList.css";
import "../dashboard/AdminDashboard.css";

function AdminFeedback() {
  const [feedbacks, setFeedbacks] =
    useState([]);

  const [stats, setStats] = useState({
    avgFood: 0,
    avgCleanliness: 0,
    avgTaste: 0,
  });

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const [
        feedbackRes,
        analyticsRes,
      ] = await Promise.all([
        getAllFeedback(),
        getFeedbackAnalytics(),
      ]);

      setFeedbacks(
        feedbackRes.feedbacks || []
      );

      setStats({
        avgFood:
          analyticsRes.data?.analytics
            ?.averageFoodQuality
            ?.toFixed(1) || 0,

        avgCleanliness:
          analyticsRes.data?.analytics
            ?.averageCleanliness
            ?.toFixed(1) || 0,

        avgTaste:
          analyticsRes.data?.analytics
            ?.averageTaste
            ?.toFixed(1) || 0,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="main-content">
        <Navbar />

        <div className="complaint-list-container">
          <h1>Manage Feedback</h1>

          <table className="complaint-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Food</th>
                <th>Cleanliness</th>
                <th>Taste</th>
                <th>Comment</th>
              </tr>
            </thead>

            <tbody>
              {feedbacks.map(
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
                        item.foodQuality
                      }
                      /5 ⭐
                    </td>

                    <td>
                      {
                        item.cleanliness
                      }
                      /5 ⭐
                    </td>

                    <td>
                      {item.taste}
                      /5 ⭐
                    </td>

                    <td>
                      {item.comment ||
                        "No Comment"}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>

          {feedbacks.length ===
            0 && (
            <p>
              No feedback found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminFeedback;