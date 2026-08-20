const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const {
  getWeeklyMenu,
  updateMenu,
  submitRating,
  getTodayRatings,
  seedMenu
} = require("../controllers/messController");

router.get("/menu", protect, getWeeklyMenu);
router.post("/menu/update", protect, authorizeRoles("admin"), updateMenu);
router.post("/rate", protect, submitRating);
router.get("/ratings", protect, getTodayRatings);
router.post("/seed", protect, authorizeRoles("admin"), seedMenu);

module.exports = router;
