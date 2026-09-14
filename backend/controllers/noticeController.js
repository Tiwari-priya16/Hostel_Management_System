const Notice = require("../models/Notice");
const { validationResult } = require("express-validator");
const { notifyAllStudents } = require("../utils/notificationHelper");

// Create Notice (Admin)
exports.createNotice = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const notice = await Notice.create({
      title: req.body.title,
      message: req.body.message,
      postedBy: req.user.id,
    });

    // Notify all students
    await notifyAllStudents(req.user.id, `New Notice: ${req.body.title}`, "notice");

    res.status(201).json({
      success: true,
      message: "Notice created successfully",
      notice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Notices
exports.getNotices = async (req, res) => {
  try {
    const notices = await Notice.find()
      .populate("postedBy", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notices.length,
      notices,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Notice (Admin)
exports.deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Notice not found",
      });
    }

    // Role-based deletion logic:
    // 1. Admin can delete any notice.
    // 2. Warden/Staff can only delete notices if the notice wasn't posted by an Admin.
    //    (Or even more strictly: only their own, but user said "cant delete super admin notice")

    if (req.user.role !== "admin") {
      // Find the user who posted it to check their role
      const User = require("../models/User");
      const poster = await User.findById(notice.postedBy);

      if (poster && poster.role === "admin") {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to delete a Super Admin notice",
        });
      }
    }

    await notice.deleteOne();

    res.status(200).json({
      success: true,
      message: "Notice deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};