import React, {
  useEffect,
  useState,
} from "react";

import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";

import "../dashboard/dashboard.css";
import "../leave/LeaveHistory.css";

import {
  getMyFeedback,
} from "../../services/feedbackService";

function FeedbackList() {
  const [feedbacks, setFeedbacks] =
    useState([]);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const res =
        await getMyFeedback();

      setFeedbacks(
        res.feedbacks || []
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
        <h1>My Feedback</h1>

        {feedbacks.length === 0 ? (
          <p>No feedback found.</p>
        ) : (
          <table className="leave-table">
            <thead>
              <tr>
                <th>Food</th>
                <th>Cleanliness</th>
                <th>Taste</th>
                <th>Comment</th>
              </tr>
            </thead>

            <tbody>
              {feedbacks.map(
                (feedback) => (
                  <tr key={feedback._id}>
                    <td>
                      {feedback.foodQuality}/5 ⭐
                    </td>

                    <td>
                      {feedback.cleanliness}/5 ⭐
                    </td>

                    <td>
                      {feedback.taste}/5 ⭐
                    </td>

                    <td>
                      {feedback.comment}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  </div>
);
}

export default FeedbackList;