const express = require("express");
const router = express.Router();

const {
  createLeave,
  getMyLeaves,
  getAllLeaves,
  approveLeave,
  rejectLeave,
  getLeaveAnalytics,
} = require("../controllers/leaveController");

const {
  createLeaveValidation,
} = require("../validators/leaveValidator");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

// Student
router.post(
  "/",
  protect,
  authorizeRoles("student"),
  createLeaveValidation,
  createLeave
);

router.get(
  "/my",
  protect,
  authorizeRoles("student"),
  getMyLeaves
);

// Admin / Warden / Staff Operations
router.get(
  "/",
  protect,
  authorizeRoles("admin", "warden", "staff"),
  getAllLeaves
);

router.put(
  "/:id/approve",
  protect,
  authorizeRoles("admin", "warden", "staff"),
  approveLeave
);

router.put(
  "/:id/reject",
  protect,
  authorizeRoles("admin", "warden", "staff"),
  rejectLeave
);

router.get(
  "/analytics",
  protect,
  authorizeRoles("admin", "warden", "staff"),
  getLeaveAnalytics
);

module.exports = router;