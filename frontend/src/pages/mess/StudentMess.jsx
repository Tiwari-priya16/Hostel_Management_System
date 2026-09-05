import React, { useEffect, useState, useContext } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { getWeeklyMenu, submitMealRating, getTodayMessRatings } from "../../services/messService";
import { FaUtensils, FaClock, FaStar, FaRegStar, FaChevronRight } from "react-icons/fa";
import { toast } from "react-toastify";
import "./Mess.css";

function StudentMess() {
  const [weeklyMenu, setWeeklyMenu] = useState([]);
  const [todayMenu, setTodayMenu] = useState(null);
  const [ratings, setRatings] = useState({ breakfast: { avg: 0 }, lunch: { avg: 0 }, dinner: { avg: 0 } });
  const [messStatus, setMessStatus] = useState({ isOpen: false, currentMeal: null, nextMeal: null });

  const [showFeedbackForm, setShowFeedbackForm] = useState(null); // mealType
  const [feedbackData, setFeedbackData] = useState({
    foodQuality: 0,
    cleanliness: 0,
    taste: 0,
    comment: ""
  });
  const [loading, setLoading] = useState(false);

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const todayName = days[new Date().getDay()];
  const todayDate = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchData();
    const timer = setInterval(checkMessStatus, 60000);
    return () => clearInterval(timer);
  }, []);

  const fetchData = async () => {
    try {
      const menuRes = await getWeeklyMenu();
      setWeeklyMenu(menuRes.menu);
      const today = menuRes.menu.find(m => m.day === todayName);
      setTodayMenu(today);

      const ratingsRes = await getTodayMessRatings(todayDate);
      setRatings(ratingsRes.analytics);

      checkMessStatus(today);
    } catch (error) {
      console.error(error);
    }
  };

  const checkMessStatus = (menu = todayMenu) => {
    if (!menu || !menu.breakfast || !menu.lunch || !menu.dinner) return;

    const now = new Date();
    const hour = now.getHours();
    const min = now.getMinutes();
    const currentTime = `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`;

    let isOpen = false;
    let currentMeal = null;
    let nextMeal = null;

    const meals = [
      { type: 'breakfast', name: 'Breakfast', ...menu.breakfast },
      { type: 'lunch', name: 'Lunch', ...menu.lunch },
      { type: 'dinner', name: 'Dinner', ...menu.dinner }
    ].filter(m => m.startTime && m.endTime);

    for (const meal of meals) {
      if (currentTime >= meal.startTime && currentTime <= meal.endTime) {
        isOpen = true;
        currentMeal = meal;
        break;
      }
    }

    if (!isOpen && meals.length > 0) {
      nextMeal = meals.find(m => m.startTime > currentTime) || meals[0];
    }

    setMessStatus({ isOpen, currentMeal, nextMeal });
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (feedbackData.foodQuality === 0 || feedbackData.cleanliness === 0 || feedbackData.taste === 0) {
      return toast.warning("Please provide ratings for all categories");
    }

    try {
      setLoading(true);
      await submitMealRating({
        mealType: showFeedbackForm,
        ...feedbackData,
        date: todayDate
      });
      toast.success("Feedback submitted! Thank you.");
      setShowFeedbackForm(null);
      setFeedbackData({ foodQuality: 0, cleanliness: 0, taste: 0, comment: "" });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  const isMealPast = (type) => {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const mealTimes = {
      breakfast: "10:00",
      lunch: "14:30",
      dinner: "22:00"
    };

    return currentTime > mealTimes[type];
  };

  const renderStarInput = (field) => (
    <div className="stars-row">
      {[1, 2, 3, 4, 5].map(star => (
        <FaStar
          key={star}
          className={`star-icon ${star <= feedbackData[field] ? 'active' : ''}`}
          onClick={() => setFeedbackData({ ...feedbackData, [field]: star })}
        />
      ))}
    </div>
  );

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />

        <div className="mess-container">
          <h1 className="dashboard-title">Mess Menu & Feedback</h1>

          {/* Real-time Status Card */}
          <div className="mess-status-card">
            <div className="status-info">
              <h2>{messStatus.isOpen ? `Currently Serving: ${messStatus.currentMeal.name}` : "Mess is currently closed"}</h2>
              <p>
                <FaClock style={{ marginRight: '8px' }} />
                {messStatus.isOpen
                  ? `Ends at ${messStatus.currentMeal.endTime}`
                  : messStatus.nextMeal
                    ? `Next meal: ${messStatus.nextMeal.name} at ${messStatus.nextMeal.startTime}`
                    : "See you tomorrow morning!"}
              </p>
            </div>
            <div className={`status-badge ${messStatus.isOpen ? 'open' : 'closed'}`}>
              {messStatus.isOpen ? "Open Now" : "Closed"}
            </div>
          </div>

          <div className="meal-grid">
            {['breakfast', 'lunch', 'dinner'].map((type) => {
              const meal = todayMenu?.[type];
              if (!meal) return null;

              const isCurrent = messStatus.isOpen && messStatus.currentMeal?.type === type;
              const isPast = isMealPast(type);

              return (
                <React.Fragment key={type}>
                  <div className={`meal-card ${isCurrent ? 'active' : ''}`}>
                    <div className="meal-header">
                      <h3><FaUtensils style={{ color: '#2563eb' }} /> {type}</h3>
                      <span className="meal-time">{meal.startTime} - {meal.endTime}</span>
                    </div>

                    <div className="meal-content">
                      <div className="items-list">
                        {meal.items.map((item, i) => (
                          <span key={i} className="item-tag">{item}</span>
                        ))}
                      </div>
                    </div>

                    <div className="meal-footer">
                      <div className="footer-top">
                        <div className="rating-display">
                          <FaStar /> <span>{ratings[type]?.avg || "0.0"}</span>
                          <small style={{ color: 'var(--text-muted)', marginLeft: '5px' }}>
                            ({ratings[type]?.count || 0} reviews)
                          </small>
                        </div>
                        <button
                          className="rate-btn"
                          onClick={() => setShowFeedbackForm(showFeedbackForm === type ? null : type)}
                          disabled={!isCurrent && !isPast}
                        >
                          {showFeedbackForm === type ? "Close Form" : "Give Feedback"}
                        </button>
                      </div>
                      {!isCurrent && !isPast && (
                        <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>
                          Feedback opens once meal starts
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Integrated Feedback Form */}
                  {showFeedbackForm === type && (
                    <div className="active-feedback-section">
                      <form className="feedback-form-container" onSubmit={handleFeedbackSubmit}>
                        <h2>Rate Today's {type}</h2>
                        <div className="rating-grid">
                          <div className="rating-item">
                            <label>Food Quality</label>
                            {renderStarInput('foodQuality')}
                          </div>
                          <div className="rating-item">
                            <label>Cleanliness</label>
                            {renderStarInput('cleanliness')}
                          </div>
                          <div className="rating-item">
                            <label>Taste</label>
                            {renderStarInput('taste')}
                          </div>
                        </div>

                        <textarea
                          className="feedback-textarea"
                          placeholder="Share your experience or suggestions..."
                          value={feedbackData.comment}
                          onChange={(e) => setFeedbackData({ ...feedbackData, comment: e.target.value })}
                        />

                        <button type="submit" className="submit-feedback-btn" disabled={loading}>
                          {loading ? "Submitting..." : "Submit Feedback"}
                        </button>
                      </form>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentMess;
