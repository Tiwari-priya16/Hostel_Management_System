const express = require("express");
const router = express.Router();

// Controllers
const {
  registerUser,
  loginUser,
  getStudents,
  getStaff,
  updateUserProfile,
  forgotPassword,
  resetPassword,
  getPendingUsers,
  approveUser,
  rejectUser,
} = require("../controllers/authController");

// Middleware
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const validate = require("../middleware/validateMiddleware");

// Validators
const {
  registerValidation,
  loginValidation,
} = require("../validators/authValidator");


// Test Route
router.get("/test", (req, res) => {
  res.send("Auth route working");
});


// Register User
router.post(
  "/register",
  registerValidation,
  validate,
  registerUser
);


// Login User
router.post(
  "/login",
  loginValidation,
  validate,
  loginUser
);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);


// Logged-in User Profile
router.get(
  "/profile",
  protect,
  (req, res) => {
    res.json({
      success: true,
      user: req.user,
    });
  }
);

router.put(
  "/profile",
  protect,
  updateUserProfile
);


// Admin Only Route
router.get(
  "/admin",
  protect,
  authorizeRoles("admin"),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome Admin",
    });
  }
);

router.get(
  "/students",
  protect,
  authorizeRoles("admin"),
  getStudents
);

router.get(
  "/staff",
  protect,
  authorizeRoles("admin"),
  getStaff
);

// Account Approval Routes (Admin Only)
router.get(
  "/pending-approvals",
  protect,
  authorizeRoles("admin"),
  getPendingUsers
);

router.put(
  "/approve/:id",
  protect,
  authorizeRoles("admin"),
  approveUser
);

router.put(
  "/reject/:id",
  protect,
  authorizeRoles("admin"),
  rejectUser
);

module.exports = router;