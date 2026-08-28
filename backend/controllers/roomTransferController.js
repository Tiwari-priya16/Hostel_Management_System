const RoomTransfer = require("../models/RoomTransfer");
const { createNotification, notifyAdmins } = require("../utils/notificationHelper");


// Student apply
exports.applyRoomTransfer = async (req, res) => {
  try {
    const transfer = await RoomTransfer.create({
      student: req.user._id,
      currentRoom: req.body.currentRoom,
      requestedRoom: req.body.requestedRoom,
      reason: req.body.reason,
    });

    // Notify Admins
    await notifyAdmins(req.user._id, `New Room Transfer Request from Student ${req.user.name}`, "room-transfer");

    res.status(201).json({
      success: true,
      message: "Room transfer request submitted",
      transfer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Student view own requests
exports.getMyTransfers = async (req, res) => {
  try {
    const transfers = await RoomTransfer.find({
      student: req.user._id,
    });

    res.json({
      success: true,
      count: transfers.length,
      transfers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Admin view all requests
exports.getAllTransfers = async (req, res) => {
  try {
    const transfers = await RoomTransfer.find()
      .populate("student", "name email roomNumber")
      .populate("approvedBy", "name email");

    res.json({
      success: true,
      count: transfers.length,
      transfers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Approve
exports.approveTransfer = async (req, res) => {
  try {
    const transfer = await RoomTransfer.findById(
      req.params.id
    );

    if (!transfer) {
      return res.status(404).json({
        success: false,
        message: "Transfer request not found",
      });
    }

    transfer.status = "Approved";
    transfer.approvedBy = req.user._id;

    await transfer.save();

    // Notify Student
    await createNotification(transfer.student, req.user._id, `Your room transfer request to ${transfer.requestedRoom} has been Approved`, "room-transfer");

    res.json({
      success: true,
      message: "Room transfer approved",
      transfer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Reject
exports.rejectTransfer = async (req, res) => {
  try {
    const transfer = await RoomTransfer.findById(
      req.params.id
    );

    if (!transfer) {
      return res.status(404).json({
        success: false,
        message: "Transfer request not found",
      });
    }

    transfer.status = "Rejected";
    transfer.approvedBy = req.user._id;

    await transfer.save();

    // Notify Student
    await createNotification(transfer.student, req.user._id, `Your room transfer request to ${transfer.requestedRoom} has been Rejected`, "room-transfer");

    res.json({
      success: true,
      message: "Room transfer rejected",
      transfer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Analytics
exports.getAnalytics = async (req, res) => {
  try {
    const total = await RoomTransfer.countDocuments();

    const pending = await RoomTransfer.countDocuments({
      status: "Pending",
    });

    const approved = await RoomTransfer.countDocuments({
      status: "Approved",
    });

    const rejected = await RoomTransfer.countDocuments({
      status: "Rejected",
    });

    res.json({
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