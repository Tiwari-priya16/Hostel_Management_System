import React, { useEffect, useState, useContext } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { getWeeklyMenu, submitMealRating, getTodayMessRatings } from "../../services/messService";
import { FaUtensils, FaClock, FaStar, FaRegStar } from "react-icons/fa";
import { toast } from "react-toastify";
import "./Mess.css";

function StudentMess() {
  const [weeklyMenu, setWeeklyMenu] = useState([]);
  const [todayMenu, setTodayMenu] = useState(null);
  const [ratings, setRatings] = useState({ breakfast: { avg: 0 }, lunch: { avg: 0 }, dinner: { avg: 0 } });
  const [messStatus, setMessStatus] = useState({ isOpen: false, currentMeal: null, nextMeal: null });
  const [showRatingPopup, setShowRatingPopup] = useState(null); // mealType
  const [selectedRating, setSelectedRating] = useState(0);

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const todayName = days[new Date().getDay()];
  const todayDate = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchData();
    const timer = setInterval(checkMessStatus, 60000); // Check every minute
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
    if (!menu) return;

    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    let isOpen = false;
    let currentMeal = null;
    let nextMeal = null;

    const meals = [
      { type: 'breakfast', name: 'Breakfast', ...menu.breakfast },
      { type: 'lunch', name: 'Lunch', ...menu.lunch },
      { type: 'dinner', name: 'Dinner', ...menu.dinner }
    ];

    for (const meal of meals) {
      if (currentTime >= meal.startTime && currentTime <= meal.endTime) {
        isOpen = true;
        currentMeal = meal;
        break;
      }
    }

    if (!isOpen) {
      nextMeal = meals.find(m => m.startTime > currentTime) || meals[0];
    }

    setMessStatus({ isOpen, currentMeal, nextMeal });
  };

  const handleRate = async () => {
    try {
      await submitMealRating({
        mealType: showRatingPopup,
        rating: selectedRating,
        date: todayDate
      });
      toast.success("Thank you for your feedback!");
      setShowRatingPopup(null);
      setSelectedRating(0);
      fetchData(); // Refresh ratings
    } catch (error) {
      toast.error(error.response?.data?.message || "Rating failed");
    }
  };

  const renderStars = (rating, interactive = false) => {
    return (
      <div className="stars">
        {[1, 2, 3, 4, 5].map(star => (
          interactive ? (
            <FaStar
              key={star}
              className={`star-icon ${star <= selectedRating ? 'active' : ''}`}
              onClick={() => setSelectedRating(star)}
            />
          ) : (
            star <= Math.round(rating) ? <FaStar key={star} /> : <FaRegStar key={star} />
          )
        ))}
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />

        <div className="mess-container">
          <h1 className="dashboard-title">Mess Menu</h1>

          {/* Real-time Status Card */}
          <div className="mess-status-card">
            <div className="status-info">
              <h2>{messStatus.isOpen ? `Mess is serving ${messStatus.currentMeal.name}` : "Mess is currently closed"}</h2>
              <p>
                <FaClock style={{ marginRight: '8px' }} />
                {messStatus.isOpen
                  ? `Ends at ${messStatus.currentMeal.endTime}`
                  : messStatus.nextMeal
                    ? `Next meal: ${messStatus.nextMeal.name} at ${messStatus.nextMeal.startTime}`
                    : "See you tomorrow!"}
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

              const isServing = messStatus.isOpen && messStatus.currentMeal?.type === type;

              return (
                <div key={type} className={`meal-card ${isServing ? 'active' : ''}`}>
                  <div className="meal-header">
                    <h3><FaUtensils style={{ marginRight: '10px', color: '#2563eb' }} /> {type}</h3>
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
                    <div className="rating-display">
                      {renderStars(ratings[type]?.avg)}
                      <span>({ratings[type]?.avg})</span>
                    </div>
                    <button
                      className="rate-btn"
                      onClick={() => setShowRatingPopup(type)}
                      disabled={!isServing}
                    >
                      Rate Meal
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Rating Popup */}
        {showRatingPopup && (
          <div className="rating-popup">
            <div className="rating-card">
              <h3>Rate Today's {showRatingPopup}</h3>
              <p>How was the quality and taste?</p>
              {renderStars(0, true)}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="rate-btn" style={{ flex: 1, background: '#64748b' }} onClick={() => setShowRatingPopup(null)}>Cancel</button>
                <button className="submit-rating-btn" style={{ flex: 2 }} onClick={handleRate} disabled={selectedRating === 0}>Submit</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentMess;
