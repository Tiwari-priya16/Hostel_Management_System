const CommunityMessage = require("../models/CommunityMessage");
const User = require("../models/User");

// Get messages for a channel
const getMessages = async (req, res) => {
  try {
    const { channelType, block, lostFoundType, page = 1, limit = 50 } = req.query;

    if (!channelType || !["general", "block", "announcement", "lost_found"].includes(channelType)) {
      return res.status(400).json({ success: false, message: "Invalid or missing channelType" });
    }

    const query = { channelType };

    // Block Community Filtering
    if (channelType === "block") {
      if (req.user.role === "admin" || req.user.role === "staff") {
        query.block = block || req.user.hostelBlock;
      } else {
        // Students are restricted to their assigned block only
        query.block = req.user.hostelBlock;
      }
    }

    // Lost & Found Filtering
    if (channelType === "lost_found" && lostFoundType && lostFoundType !== "ALL") {
      if (["LOST", "FOUND"].includes(lostFoundType)) {
        query.lostFoundType = lostFoundType;
      }
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Sorting: Announcements show pinned first then newest; Chats/Feeds sort appropriately
    const sortOption = channelType === "announcement"
      ? { isPinned: -1, createdAt: -1 }
      : channelType === "lost_found"
      ? { createdAt: -1 }
      : { createdAt: 1 };

    const messages = await CommunityMessage.find(query)
      .populate("sender", "name email role profilePic hostelBlock roomNumber")
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    const totalCount = await CommunityMessage.countDocuments(query);

    res.status(200).json({
      success: true,
      count: messages.length,
      totalCount,
      page: pageNum,
      totalPages: Math.ceil(totalCount / limitNum),
      messages,
    });
  } catch (error) {
    console.error("Get Community Messages Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Send a message or post
const sendMessage = async (req, res) => {
  try {
    const { channelType, content, image, lostFoundType, block } = req.body;

    if (!channelType || !["general", "block", "announcement", "lost_found"].includes(channelType)) {
      return res.status(400).json({ success: false, message: "Invalid channelType" });
    }

    // 1. Announcements restriction: Only Admin/Staff can post
    if (channelType === "announcement" && req.user.role !== "admin" && req.user.role !== "staff") {
      return res.status(403).json({ success: false, message: "Only Admins/Wardens can create announcements" });
    }

    // 2. Content or Image requirement
    if ((!content || !content.trim()) && !image) {
      return res.status(400).json({ success: false, message: "Message must contain text content or an image" });
    }

    // 3. Channel specific logic
    let targetBlock = "";
    if (channelType === "block") {
      targetBlock = (req.user.role === "admin" || req.user.role === "staff")
        ? (block || req.user.hostelBlock)
        : req.user.hostelBlock;

      if (!targetBlock) {
        return res.status(400).json({ success: false, message: "No hostel block assigned to user" });
      }
    }

    let targetLostFoundType = null;
    if (channelType === "lost_found") {
      if (!["LOST", "FOUND"].includes(lostFoundType)) {
        return res.status(400).json({ success: false, message: "Please select tag: LOST or FOUND" });
      }
      targetLostFoundType = lostFoundType;
    }

    const newMessage = await CommunityMessage.create({
      sender: req.user._id,
      channelType,
      block: targetBlock,
      content: content ? content.trim() : "",
      image: image || "",
      lostFoundType: targetLostFoundType,
    });

    const populatedMessage = await CommunityMessage.findById(newMessage._id)
      .populate("sender", "name email role profilePic hostelBlock roomNumber");

    res.status(201).json({
      success: true,
      message: "Message posted successfully",
      data: populatedMessage,
    });
  } catch (error) {
    console.error("Send Community Message Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a message or post
const deleteMessage = async (req, res) => {
  try {
    const message = await CommunityMessage.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    // Students can only delete their OWN messages. Admins/Staff can delete ANY message for moderation.
    if (req.user.role !== "admin" && req.user.role !== "staff" && message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "You can only delete your own messages" });
    }

    await message.deleteOne();

    res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.error("Delete Community Message Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Toggle Pin on Announcement (Admin only)
const togglePinAnnouncement = async (req, res) => {
  try {
    const message = await CommunityMessage.findById(req.params.id);

    if (!message || message.channelType !== "announcement") {
      return res.status(404).json({ success: false, message: "Announcement not found" });
    }

    if (req.user.role !== "admin" && req.user.role !== "staff") {
      return res.status(403).json({ success: false, message: "Only Admins can pin announcements" });
    }

    message.isPinned = !message.isPinned;
    await message.save();

    res.status(200).json({
      success: true,
      message: message.isPinned ? "Announcement pinned" : "Announcement unpinned",
      isPinned: message.isPinned,
    });
  } catch (error) {
    console.error("Pin Announcement Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMessages,
  sendMessage,
  deleteMessage,
  togglePinAnnouncement,
};
