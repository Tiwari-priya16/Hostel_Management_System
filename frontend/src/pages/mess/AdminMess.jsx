import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { getWeeklyMenu, updateMessMenu, getTodayMessRatings } from "../../services/messService";
import { FaEdit, FaSave, FaChartBar, FaCalendarDay } from "react-icons/fa";
import { toast } from "react-toastify";
import "./Mess.css";

function AdminMess() {
  const [weeklyMenu, setWeeklyMenu] = useState([]);
  const [selectedDay, setSelectedDay] = useState(new Date().toLocaleDateString('en-IN', { weekday: 'long' }));
  const [editMode, setEditMode] = useState(null); // mealType
  const [tempItems, setEditItems] = useState("");
  const [ratings, setRatings] = useState({ breakfast: { avg: 0, count: 0 }, lunch: { avg: 0, count: 0 }, dinner: { avg: 0, count: 0 } });

  const todayDate = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const menuRes = await getWeeklyMenu();
      setWeeklyMenu(menuRes.menu);
      const ratingsRes = await getTodayMessRatings(todayDate);
      setRatings(ratingsRes.analytics);
    } catch (error) {
      console.error(error);
    }
  };

  const currentDayMenu = weeklyMenu.find(m => m.day === selectedDay);

  const startEdit = (type) => {
    setEditMode(type);
    setEditItems(currentDayMenu[type].items.join(", "));
  };

  const handleSave = async () => {
    try {
      const updatedMenu = { ...currentDayMenu };
      updatedMenu[editMode].items = tempItems.split(",").map(i => i.trim()).filter(i => i !== "");

      await updateMessMenu(updatedMenu);
      toast.success("Menu updated successfully!");
      setEditMode(null);
      fetchData();
    } catch (error) {
      toast.error("Failed to update menu");
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />

        <div className="mess-container">
          <h1 className="dashboard-title">Mess Management</h1>

          <div className="admin-actions">
            <div className="day-selector-container">
              <FaCalendarDay style={{ marginRight: '10px', color: '#2563eb' }} />
              <select
                className="day-selector"
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
              >
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>

            <div className="analytics-summary" style={{ marginLeft: 'auto', display: 'flex', gap: '20px' }}>
               <div className="summary-card" style={{ minWidth: '150px' }}>
                 <small>Breakfast Rating</small>
                 <span>⭐ {ratings.breakfast.avg} ({ratings.breakfast.count})</span>
               </div>
               <div className="summary-card" style={{ minWidth: '150px' }}>
                 <small>Lunch Rating</small>
                 <span>⭐ {ratings.lunch.avg} ({ratings.lunch.count})</span>
               </div>
               <div className="summary-card" style={{ minWidth: '150px' }}>
                 <small>Dinner Rating</small>
                 <span>⭐ {ratings.dinner.avg} ({ratings.dinner.count})</span>
               </div>
            </div>
          </div>

          <div className="meal-grid">
            {['breakfast', 'lunch', 'dinner'].map((type) => {
              const meal = currentDayMenu?.[type];
              if (!meal) return null;

              return (
                <div key={type} className="meal-card">
                  <div className="meal-header">
                    <h3>{type}</h3>
                    {editMode !== type && (
                      <button className="icon-btn" onClick={() => startEdit(type)}>
                        <FaEdit />
                      </button>
                    )}
                  </div>

                  <div className="meal-content">
                    {editMode === type ? (
                      <div>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Separate items with commas</p>
                        <textarea
                          className="edit-items-area"
                          value={tempItems}
                          onChange={(e) => setEditItems(e.target.value)}
                        />
                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                           <button className="rate-btn" style={{ background: '#64748b' }} onClick={() => setEditMode(null)}>Cancel</button>
                           <button className="save-menu-btn" style={{ marginTop: 0 }} onClick={handleSave}>Save Changes</button>
                        </div>
                      </div>
                    ) : (
                      <div className="items-list">
                        {meal.items.map((item, i) => (
                          <span key={i} className="item-tag">{item}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminMess;
