import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createFeedback } from "../../services/feedbackService";

import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";

import "../dashboard/dashboard.css";
import "../leave/ApplyLeave.css";
import "./Feedback.css";

function GiveFeedback() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    foodQuality: 5,
    cleanliness: 5,
    taste: 5,
    comment: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createFeedback(formData);

      alert("Feedback submitted successfully");

      setFormData({
        foodQuality: 5,
        cleanliness: 5,
        taste: 5,
        comment: "",
      });

      navigate("/feedback/history");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to submit feedback"
      );
    }
  };

  const renderStars = (field) => {
    return (
      <div className="rating-stars">
        {[1, 2, 3, 4, 5].map((num) => (
          <span
            key={num}
            className={
              num <= formData[field]
                ? "star active"
                : "star"
            }
            onClick={() =>
              setFormData({
                ...formData,
                [field]: num,
              })
            }
          >
            ⭐
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="content">
        <Navbar />

        <div className="leave-container">
          <div className="leave-card">
            <h1>Give Feedback</h1>

            <form onSubmit={handleSubmit}>

              <div className="feedback-group">
                <label>Food Quality</label>
                {renderStars("foodQuality")}
              </div>

              <div className="feedback-group">
                <label>Cleanliness</label>
                {renderStars("cleanliness")}
              </div>

              <div className="feedback-group">
                <label>Taste</label>
                {renderStars("taste")}
              </div>

              <textarea
                name="comment"
                placeholder="Write your feedback..."
                rows="5"
                value={formData.comment}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    comment: e.target.value,
                  })
                }
              />

              <button type="submit">
                Submit Feedback
              </button>

              <button
                type="button"
                style={{ marginTop: "10px" }}
                onClick={() =>
                  navigate("/feedback/history")
                }
              >
                View History
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GiveFeedback;