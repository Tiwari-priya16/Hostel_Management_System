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

// Create Notice (Admin)
router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  createNoticeValidation,
  createNotice
);

// Get All Notices
router.get("/", protect, getNotices);

// Delete Notice (Admin)
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteNotice
);

module.exports = router;