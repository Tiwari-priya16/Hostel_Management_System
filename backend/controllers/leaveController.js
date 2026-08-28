const Leave = require("../models/Leave");
const { validationResult } = require("express-validator");
const { createNotification, notifyAdmins } = require("../utils/notificationHelper");

// Create Leave
exports.createLeave = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const leave = await Leave.create({
      student: req.user.id,
      reason: req.body.reason,
      fromDate: req.body.fromDate,
      toDate: req.body.toDate,
    });

    // Notify Admins (Async)
    notifyAdmins(req.user.id, `New leave request from Student: ${req.user.name}`, "leave");

    res.status(201).json({
      success: true,
      message: "Leave applied successfully",
      leave,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Student's leaves
exports.getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({
      student: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: leaves.length,
      leaves,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Admin: all leaves
exports.getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate("student", "name email roomNumber")
      .populate("approvedBy", "name role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: leaves.length,
      leaves,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Approve Leave
exports.approveLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave not found",
      });
    }

    leave.status = "Approved";
    leave.approvedBy = req.user.id;

    await leave.save();

    // Notify Student (Async)
    createNotification(
      leave.student,
      req.user.id,
      "Your leave request has been Approved",
      "leave"
    );

    res.status(200).json({
      success: true,
      message: "Leave approved successfully",
      leave,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Reject Leave
exports.rejectLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave not found",
      });
    }

    leave.status = "Rejected";
    leave.approvedBy = req.user._id;

    await leave.save();

    // Notify Student
    await createNotification(
      leave.student,
      req.user._id,
      "Your leave request has been Rejected",
      "leave"
    );

    res.status(200).json({
      success: true,
      message: "Leave rejected successfully",
      leave,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Analytics
exports.getLeaveAnalytics = async (req, res) => {
  try {
    const total = await Leave.countDocuments();
    const pending = await Leave.countDocuments({ status: "Pending" });
    const approved = await Leave.countDocuments({ status: "Approved" });
    const rejected = await Leave.countDocuments({ status: "Rejected" });

    res.status(200).json({
      success: true,
      analytics: {
        total,
        pending,
        approved,
        rejected,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};