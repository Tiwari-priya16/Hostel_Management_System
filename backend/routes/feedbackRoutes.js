const express = require("express");

const {
  createFeedback,
  getMyFeedback,
  getAllFeedback,
  getFeedbackAnalytics,
} = require("../controllers/feedbackController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const {
  createFeedbackValidator,
} = require("../validators/feedbackValidator");

const validate = require("../middleware/validateMiddleware");

const router = express.Router();

// Student creates feedback
router.post(
  "/",
  protect,
  authorizeRoles("student"),
  createFeedbackValidator,
  validate,
  createFeedback
);

// Student views own feedback
router.get(
  "/my",
  protect,
  authorizeRoles("student"),
  getMyFeedback
);

// Admin views all feedback
router.get(
  "/",
  protect,
  authorizeRoles("admin"),
  getAllFeedback
);

// Analytics
router.get(
  "/analytics",
  protect,
  authorizeRoles("admin"),
  getFeedbackAnalytics
);

module.exports = router;