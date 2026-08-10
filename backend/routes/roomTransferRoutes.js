const express = require("express");
const router = express.Router();

const {
  applyRoomTransfer,
  getMyTransfers,
  getAllTransfers,
  approveTransfer,
  rejectTransfer,
  getAnalytics,
} = require("../controllers/roomTransferController");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const {
  roomTransferValidation,
} = require("../validators/roomTransferValidator");

const validate = require("../middleware/validateMiddleware");


// Student
router.post(
  "/",
  protect,
  authorizeRoles("student"),
  roomTransferValidation,
  validate,
  applyRoomTransfer
);

router.get(
  "/my",
  protect,
  authorizeRoles("student"),
  getMyTransfers
);


// Admin
router.get(
  "/",
  protect,
  authorizeRoles("admin"),
  getAllTransfers
);

router.put(
  "/:id/approve",
  protect,
  authorizeRoles("admin"),
  approveTransfer
);

router.put(
  "/:id/reject",
  protect,
  authorizeRoles("admin"),
  rejectTransfer
);

router.get(
  "/analytics",
  protect,
  authorizeRoles("admin"),
  getAnalytics
);

module.exports = router;