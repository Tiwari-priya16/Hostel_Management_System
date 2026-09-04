const User = require("../models/User");
const OTP = require("../models/OTP");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/emailHelper");

// Forgot Password - Send OTP
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found with this email" });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP to DB
    await OTP.findOneAndUpdate(
      { email },
      { otp, createdAt: new Date() },
      { upsert: true, returnDocument: 'after' }
    );

    // Send Real Email
    const message = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #2563eb; text-align: center;">HostelSync Password Reset</h2>
        <p>Hello,</p>
        <p>You requested a password reset. Please use the following One-Time Password (OTP) to reset your account password. This OTP is valid for 5 minutes.</p>
        <div style="background: #f1f5f9; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #0f172a; margin: 20px 0; border-radius: 5px;">
          ${otp}
        </div>
        <p>If you did not request this, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #666; text-align: center;">© 2026 HostelSync Management System</p>
      </div>
    `;

    await sendEmail({
      email: user.email,
      subject: "Your HostelSync Password Reset OTP",
      html: message,
    });

    res.json({ success: true, message: "OTP sent to your email successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reset Password - Verify OTP and update
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const otpRecord = await OTP.findOne({ email, otp });

    if (!otpRecord) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    // Delete OTP record
    await OTP.deleteOne({ _id: otpRecord._id });

    res.json({ success: true, message: "Password reset successful. Please login." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Register User
const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      phone,
      roomNumber,
      hostelBlock,
    } = req.body;

    // Prevent public Admin registration
    if (role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin accounts cannot be registered publicly.",
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userRole = role || "student";
    const userRoom = (userRole === "warden" || userRole === "staff") && !roomNumber
      ? "Warden Office"
      : roomNumber;

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: userRole,
      phone,
      roomNumber: userRoom,
      hostelBlock,
    });

    user.password = undefined;

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token: generateToken(user._id),
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getStudents = async (req, res) => {
  try {
    const students = await User.find(
      { role: "student" },
      "-password"
    );

    res.json({
      success: true,
      students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getStaff = async (req, res) => {
  try {
    const staff = await User.find(
      { role: { $in: ["staff", "warden"] } },
      "-password"
    );

    res.json({
      success: true,
      staff,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    user.password = undefined;

    res.status(200).json({
      success: true,
      message: "Login successful",
      token: generateToken(user._id),
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.phone = req.body.phone || user.phone;
      user.roomNumber = req.body.roomNumber || user.roomNumber;
      user.hostelBlock = req.body.hostelBlock || user.hostelBlock;

      if (req.body.profilePic !== undefined) {
        user.profilePic = req.body.profilePic;
      }

      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
      }

      const updatedUser = await user.save();
      updatedUser.password = undefined;

      res.json({
        success: true,
        user: updatedUser,
      });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getStudents,
  getStaff,
  updateUserProfile,
  forgotPassword,
  resetPassword,
};
