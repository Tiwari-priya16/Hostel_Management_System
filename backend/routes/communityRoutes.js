const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const {
  getMessages,
  sendMessage,
  deleteMessage,
  togglePinAnnouncement,
} = require("../controllers/communityController");

router.get("/messages", protect, getMessages);
router.post("/messages", protect, sendMessage);
router.delete("/messages/:id", protect, deleteMessage);
router.patch("/messages/:id/pin", protect, authorizeRoles("admin", "warden", "staff"), togglePinAnnouncement);

module.exports = router;
