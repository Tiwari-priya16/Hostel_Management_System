import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { registerUser } from "../../services/authService";
import logo from "../../assets/hostelsync-logo.png";
import "./auth.css";

function Register() {
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState("student"); // student or warden

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    roomNumber: "",
    hostelBlock: "Block A",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
      toast.warning("Please fill all required fields");
      return;
    }

    if (selectedRole === "student" && (!formData.roomNumber || !formData.hostelBlock)) {
      toast.warning("Room Number and Hostel Block are required for Students");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: selectedRole,
        hostelBlock: formData.hostelBlock,
        roomNumber: selectedRole === "warden" ? "Warden Office" : formData.roomNumber,
        password: formData.password,
      };

      const res = await registerUser(payload);

      toast.success(
        res.data?.message || `Registration Successful as ${selectedRole === "warden" ? "Warden" : "Student"}! Redirecting...`
      );

      setTimeout(() => {
        navigate("/");
      }, 1800);

    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || "Registration Failed";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-orb auth-orb-one"></div>
      <div className="auth-orb auth-orb-two"></div>
      <div className="auth-card">
        <img
          src={logo}
          alt="HostelSync"
          className="auth-logo"
        />

        <h2>Create Account</h2>
        <p>Register for HostelSync Portal</p>

        {/* Role Selector Tabs */}
        <div className="role-selector" style={{ marginBottom: "20px" }}>
          <div
            className={`role-tab ${selectedRole === 'student' ? 'active' : ''}`}
            onClick={() => setSelectedRole('student')}
          >
            Student
          </div>
          <div
            className={`role-tab ${selectedRole === 'warden' ? 'active' : ''}`}
            onClick={() => setSelectedRole('warden')}
          >
            Warden / Caretaker
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <div className="form-group" style={{ margin: "10px 0 15px", textAlign: "left" }}>
            <label style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "5px", display: "block" }}>
              Assigned Hostel Block
            </label>
            <select
              name="hostelBlock"
              value={formData.hostelBlock}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                background: "var(--bg-primary)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-color)",
                outline: "none"
              }}
            >
              <option value="Block A">Block A</option>
              <option value="Block B">Block B</option>
              <option value="Block C">Block C</option>
              <option value="Block D">Block D</option>
            </select>
          </div>

          {selectedRole === "student" && (
            <input
              type="text"
              name="roomNumber"
              placeholder="Room Number (e.g. A-102)"
              value={formData.roomNumber}
              onChange={handleChange}
              required
            />
          )}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : `Register as ${selectedRole === 'warden' ? 'Warden' : 'Student'}`}
          </button>
        </form>

        <div className="auth-link">
          Already have an account?
          <span onClick={() => navigate("/")}>
            Login
          </span>
        </div>
      </div>
    </div>
  );
}

export default Register;
