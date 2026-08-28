import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { forgotPassword, resetPassword } from "../../services/authService";
import logo from "../../assets/hostelsync-logo.png";
import "./auth.css";

function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Pass
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0); // Resend timer in seconds

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSendOTP = async (e) => {
    if (e) e.preventDefault();
    if (!email) return toast.error("Please enter email");

    try {
      setLoading(true);
      const res = await forgotPassword({ email });
      if (res.data.success) {
        toast.success(res.data.message);
        setStep(2);
        setTimer(300); // Start 5 minute cooldown
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return toast.error("Passwords do not match");

    try {
      setLoading(true);
      const res = await resetPassword({ email, otp, newPassword });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP or error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-orb auth-orb-one"></div>
      <div className="auth-orb auth-orb-two"></div>
      <div className="auth-card">
        <img src={logo} alt="HostelSync" className="auth-logo" />
        <h2>{step === 1 ? "Forgot Password" : "Reset Password"}</h2>
        <p>{step === 1 ? "Enter your email to receive an OTP" : "Enter the OTP sent to your email and your new password"}</p>

        {step === 1 ? (
          <form onSubmit={handleSendOTP}>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleReset}>
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <div className="resend-section" style={{ textAlign: 'right', margin: '5px 0 15px', fontSize: '13px' }}>
              {timer > 0 ? (
                <span style={{ color: '#64748b' }}>Resend OTP in <span style={{ color: '#2563eb', fontWeight: '600' }}>{formatTime(timer)}</span></span>
              ) : (
                <span onClick={handleSendOTP} style={{ color: '#2563eb', cursor: 'pointer', fontWeight: '600' }}>Resend OTP</span>
              )}
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        <p className="auth-link">
          Remember your password?{" "}
          <span onClick={() => navigate("/")}>Login</span>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
