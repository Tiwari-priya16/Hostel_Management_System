const express = require("express");
const router = express.Router();


const { protect,authorizeRoles } = require("../middleware/authMiddleware");
const { createVisitor, 
    getMyVisitors,
    getAllVisitors,
    approveVisitor,
    rejectVisitor,
    checkOutVisitor,
    checkInVisitor,} = require("../controllers/visitorController");

router.post("/", protect, createVisitor);
router.get("/my", protect, getMyVisitors);

router.get(
  "/",
  protect,
  authorizeRoles("admin", "warden", "staff"),
  getAllVisitors
);

router.put(
  "/:id/approve",
  protect,
  authorizeRoles("admin", "warden", "staff"),
  approveVisitor
);

router.put(
  "/:id/reject",
  protect,
  authorizeRoles("admin", "warden", "staff"),
  rejectVisitor
);

router.put(
  "/:id/checkin",
  protect,
  authorizeRoles("staff"),
  checkInVisitor
);

router.put(
  "/:id/checkout",
  protect,
  authorizeRoles("staff"),
  checkOutVisitor
);

module.exports = router;