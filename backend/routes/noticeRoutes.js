const express = require("express");
const router = express.Router();

const {
  createNotice,
  getNotices,
  deleteNotice,
} = require("../controllers/noticeController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const {
  createNoticeValidation,
} = require("../validators/noticeValidator");

// Create Notice
router.post(
  "/",
  protect,
  authorizeRoles("admin", "warden", "staff"),
  createNoticeValidation,
  createNotice
);

// Get All Notices
router.get("/", protect, getNotices);

// Delete Notice
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin", "warden", "staff"),
  deleteNotice
);

module.exports = router;