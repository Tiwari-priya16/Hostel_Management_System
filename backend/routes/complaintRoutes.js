const express = require("express");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  updateComplaintStatus,
  assignStaff,
  deleteComplaint,
  getAssignedComplaints,
  getComplaintAnalytics,
} = require("../controllers/complaintController");

const {
  validateComplaintStatus,
} = require("../validators/complaintValidator");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createComplaint);
router.get("/my", protect, getMyComplaints);

router.get(
  "/assigned",
  protect,
  authorizeRoles("staff"),
  getAssignedComplaints
);

router.get(
  "/analytics",
  protect,
  authorizeRoles("admin", "warden", "staff"),
  getComplaintAnalytics
);

router.get(
  "/",
  protect,
  authorizeRoles("admin", "warden", "staff"),
  getAllComplaints
);

router.put(
  "/:id/status",
  protect,
  authorizeRoles("admin", "warden", "staff"),
  validateComplaintStatus,
  updateComplaintStatus
);

router.put(
  "/:id/assign",
  protect,
  authorizeRoles("admin"),
  assignStaff
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteComplaint
);



module.exports = router;