import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { updateUserProfile } from "../../services/userService";
import { toast } from "react-toastify";
import { FaUser, FaPhone, FaEnvelope, FaBuilding, FaDoorOpen, FaLock, FaCamera } from "react-icons/fa";
import "./Profile.css";

function Profile() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    roomNumber: user?.roomNumber || "",
    hostelBlock: user?.hostelBlock || "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setLoading(true);
      const res = await updateUserProfile(formData);
      if (res.success) {
        localStorage.setItem("user", JSON.stringify(res.user));
        setUser(res.user);
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />

        <div className="profile-container">
          <div className="profile-header-card">
            <div className="profile-avatar-section">
              <div className="avatar-wrapper">
                <FaUser className="default-avatar" />
                <button className="edit-avatar-btn" title="Upload Photo">
                  <FaCamera />
                </button>
              </div>
              <div className="profile-header-info">
                <h1>{user?.name}</h1>
                <span className="profile-role-badge">{user?.role}</span>
              </div>
            </div>
          </div>

          <div className="profile-grid">
            <div className="profile-form-card">
              <h3>Personal Information</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label><FaUser /> Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label><FaEnvelope /> Email Address</label>
                  <input type="email" value={user?.email} disabled className="disabled-input" />
                </div>

                <div className="form-group">
                  <label><FaPhone /> Phone Number</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
                </div>

                {user?.role === "student" && (
                  <div className="form-row">
                    <div className="form-group">
                      <label><FaBuilding /> Hostel Block</label>
                      <input type="text" name="hostelBlock" value={formData.hostelBlock} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label><FaDoorOpen /> Room No.</label>
                      <input type="text" name="roomNumber" value={formData.roomNumber} onChange={handleChange} />
                    </div>
                  </div>
                )}

                <div className="form-divider">Change Password</div>

                <div className="form-row">
                  <div className="form-group">
                    <label><FaLock /> New Password</label>
                    <input type="password" name="password" placeholder="Leave blank to keep same" value={formData.password} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label><FaLock /> Confirm Password</label>
                    <input type="password" name="confirmPassword" placeholder="Confirm new password" value={formData.confirmPassword} onChange={handleChange} />
                  </div>
                </div>

                <button type="submit" className="update-profile-btn" disabled={loading}>
                  {loading ? "Updating..." : "Update Profile"}
                </button>
              </form>
            </div>

            <div className="profile-stats-card">
              <h3>Account Overview</h3>
              <div className="stat-item">
                <span>Member Since</span>
                <strong>{new Date(user?.createdAt).toLocaleDateString()}</strong>
              </div>
              <div className="stat-item">
                <span>Account Status</span>
                <strong className="status-active">Active</strong>
              </div>
              {user?.role === "student" && (
                <div className="stat-item">
                  <span>Current Floor</span>
                  <strong>{user?.roomNumber?.charAt(0) || "1"}st Floor</strong>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
