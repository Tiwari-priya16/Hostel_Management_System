const express = require("express");
const router = express.Router();

const {
  createLaundrySlot,
  getMyBookings,
  getAllBookings,
  cancelBooking,
  completeBooking,
  getLaundryAnalytics,
  deleteBooking,
} = require("../controllers/laundryController");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const {
  validateLaundryBooking,
} = require("../validators/laundryValidator");

router.post(
  "/",
  protect,
  authorizeRoles("student"),
  validateLaundryBooking,
  createLaundrySlot
);

router.get(
  "/my",
  protect,
  authorizeRoles("student"),
  getMyBookings
);

router.get(
  "/analytics",
  protect,
  authorizeRoles("admin"),
  getLaundryAnalytics
);

router.get(
  "/",
  protect,
  authorizeRoles("admin"),
  getAllBookings
);

router.put(
  "/:id/cancel",
  protect,
  authorizeRoles("student"),
  cancelBooking
);

router.put(
  "/:id/complete",
  protect,
  authorizeRoles("admin", "staff"),
  completeBooking
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("admin", "staff"),
  deleteBooking
);

module.exports = router;