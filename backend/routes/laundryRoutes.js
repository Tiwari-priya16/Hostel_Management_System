const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const {
  getMachines,
  addMachine,
  updateMachine,
  createBooking,
  getMyBookings,
  getAllBookings,
  cancelBooking,
  reportProblem,
  getMaintenanceRequests,
  resolveMaintenance,
  getSettings,
  updateSettings
} = require("../controllers/laundryController");

// Machines
router.get("/machines", protect, getMachines);
router.post("/machines", protect, authorizeRoles("admin"), addMachine);
router.put("/machines/:id", protect, authorizeRoles("admin"), updateMachine);

// Bookings
router.get("/bookings", protect, authorizeRoles("admin"), getAllBookings);
router.get("/bookings/my", protect, getMyBookings);
router.post("/bookings", protect, createBooking);
router.patch("/bookings/:id/cancel", protect, cancelBooking);

// Maintenance
router.get("/maintenance", protect, authorizeRoles("admin"), getMaintenanceRequests);
router.post("/maintenance", protect, reportProblem);
router.patch("/maintenance/:id/resolve", protect, authorizeRoles("admin"), resolveMaintenance);

// Settings
router.get("/settings", protect, getSettings);
router.put("/settings", protect, authorizeRoles("admin"), updateSettings);

module.exports = router;
