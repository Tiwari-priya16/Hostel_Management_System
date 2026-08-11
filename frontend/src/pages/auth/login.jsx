import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import logo from "../../assets/hostelsync-logo.png";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await loginUser({
        email,
        password,
      });

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      // Login ke baad redirect
      if (res.data.user.role === "admin") {
        navigate("/dashboard/admin");
      } else if (res.data.user.role === "staff") {
        navigate("/dashboard/staff");
      } else {
        navigate("/dashboard/student");
      }

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Login Failed"
      );
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

      <h2>Welcome Back</h2>
      <p>Login to continue</p>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button type="submit">
          Login
        </button>
      </form>

      <p className="auth-link">
        Don't have an account?
        <span
          onClick={() =>
            navigate("/register")
          }
        >
          Register
        </span>
      </p>
    </div>
  </div>
);
}

export default Login;