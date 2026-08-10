const express = require("express");
const router = express.Router();

// Controllers
const {
  registerUser,
  loginUser,
  getStudents,
getStaff,
} = require("../controllers/authController");

// Middleware
const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
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

module.exports = router;