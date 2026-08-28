const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const {
  recordExit,
  recordEntry,
  getMyHistory,
  getAdminStats,
  getAllHistory
} = require("../controllers/gateController");

router.post("/exit", protect, recordExit);
router.post("/entry", protect, recordEntry);
router.get("/my-history", protect, getMyHistory);
router.get("/admin/stats", protect, authorizeRoles("admin"), getAdminStats);
router.get("/admin/history", protect, authorizeRoles("admin"), getAllHistory);

module.exports = router;
