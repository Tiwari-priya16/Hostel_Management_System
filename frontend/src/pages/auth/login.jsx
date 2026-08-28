import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUser } from "../../services/authService";
import logo from "../../assets/hostelsync-logo.png";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    try {
      setLoading(true);
      const res = await loginUser({
        email,
        password,
      });

      // Role check: If user selected 'admin' but the account is 'student', or vice versa
      const userRole = res.data.user.role;

      // Basic role verification
      if (role === "admin" && userRole !== "admin") {
         toast.error("Access Denied: You are not an Admin");
         setLoading(false);
         return;
      }

      if (role === "student" && userRole === "admin") {
        toast.error("Admin accounts must use Admin login");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Login Successful! Redirecting...");

      // Small delay for better UX
      setTimeout(() => {
        if (userRole === "admin") {
          navigate("/dashboard/admin");
        } else if (userRole === "staff") {
          navigate("/dashboard/staff");
        } else {
          navigate("/dashboard/student");
        }
      }, 1500);

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login Failed. Please check your credentials."
      );
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

      <h2>Welcome Back</h2>
      <p>Login to continue</p>

      {/* Role Selection Tabs */}
      <div className="role-selector">
        <div
          className={`role-tab ${role === 'student' ? 'active' : ''}`}
          onClick={() => setRole('student')}
        >
          Student
        </div>
        <div
          className={`role-tab ${role === 'admin' ? 'active' : ''}`}
          onClick={() => setRole('admin')}
        >
          Admin
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          required
        />

        <div className="forgot-password-link" style={{ textAlign: 'right', margin: '5px 0 15px' }}>
          <span
            onClick={() => navigate("/forgot-password")}
            style={{ color: '#2563eb', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}
          >
            Forgot Password?
          </span>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
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