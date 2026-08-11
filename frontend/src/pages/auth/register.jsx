import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";
import logo from "../../assets/hostelsync-logo.png";
import "./auth.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    roomNumber: "",
    hostelBlock: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] =
    useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.roomNumber ||
      !formData.hostelBlock ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      alert(
        "Please fill all fields"
      );
      return;
    }

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      alert(
        "Passwords do not match"
      );
      return;
    }

    try {
      setLoading(true);

      const res =
        await registerUser({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          roomNumber:
            formData.roomNumber,
          hostelBlock:
            formData.hostelBlock,
          password:
            formData.password,
        });

      alert(
        res.data?.message ||
          "Registration Successful"
      );

      navigate("/");
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data
          ?.message ||
          "Registration Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <img
          src={logo}
          alt="HostelSync"
          className="auth-logo"
        />

        <h2>Create Account</h2>

        <p>
          Register to access
          HostelSync Hostel
          Management System
        </p>

        <form
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={
              handleChange
            }
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={
              handleChange
            }
            required
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={
              handleChange
            }
            required
          />

          <input
            type="text"
            name="roomNumber"
            placeholder="Room Number"
            value={
              formData.roomNumber
            }
            onChange={
              handleChange
            }
            required
          />

          <input
            type="text"
            name="hostelBlock"
            placeholder="Hostel Block"
            value={
              formData.hostelBlock
            }
            onChange={
              handleChange
            }
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={
              formData.password
            }
            onChange={
              handleChange
            }
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={
              formData.confirmPassword
            }
            onChange={
              handleChange
            }
            required
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Registering..."
              : "Register"}
          </button>
        </form>

        <div className="auth-link">
          Already have an
          account?

          <span
            onClick={() =>
              navigate("/")
            }
          >
            Login
          </span>
        </div>
      </div>
    </div>
  );
}

export default Register;