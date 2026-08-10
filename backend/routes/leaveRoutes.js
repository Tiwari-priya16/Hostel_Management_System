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

// Admin
router.get(
  "/",
  protect,
  authorizeRoles("admin"),
  getAllLeaves
);

router.put(
  "/:id/approve",
  protect,
  authorizeRoles("admin"),
  approveLeave
);

router.put(
  "/:id/reject",
  protect,
  authorizeRoles("admin"),
  rejectLeave
);

router.get(
  "/analytics",
  protect,
  authorizeRoles("admin"),
  getLeaveAnalytics
);

module.exports = router;