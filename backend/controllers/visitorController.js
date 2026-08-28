const Visitor = require("../models/Visitor");
const { createNotification, notifyAdmins } = require("../utils/notificationHelper");

// Create Visitor Request
const createVisitor = async (req, res) => {
  try {
    const {
      visitorName,
      phone,
      relation,
      visitDate,
    } = req.body;

    const visitor = await Visitor.create({
      visitorName,
      phone,
      relation,
      visitDate,
      student: req.user._id,
    });

    // Notify Admins (Async)
    notifyAdmins(req.user._id, `New Visitor Request: ${visitorName} for Student ${req.user.name}`, "visitor");

    res.status(201).json({
      success: true,
      message: "Visitor request created successfully",
      visitor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find({
      student: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: visitors.length,
      visitors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find()
      .populate("student", "name email roomNumber")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: visitors.length,
      visitors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const approveVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);

    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: "Visitor not found",
      });
    }

    visitor.status = "Approved";
    visitor.approvedBy = req.user._id;

    await visitor.save();

    // Notify Student (Async)
    createNotification(visitor.student, req.user._id, `Your visitor request for ${visitor.visitorName} has been Approved`, "visitor");

    res.status(200).json({
      success: true,
      message: "Visitor approved successfully",
      visitor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const rejectVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);

    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: "Visitor not found",
      });
    }

    visitor.status = "Rejected";
    visitor.approvedBy = req.user._id;

    await visitor.save();

    // Notify Student (Async)
    createNotification(visitor.student, req.user._id, `Your visitor request for ${visitor.visitorName} has been Rejected`, "visitor");

    res.status(200).json({
      success: true,
      message: "Visitor rejected successfully",
      visitor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const checkInVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);

    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: "Visitor not found",
      });
    }

    if (visitor.status !== "Approved") {
      return res.status(400).json({
        success: false,
        message: "Visitor is not approved yet",
      });
    }

    visitor.status = "Checked-In";
    visitor.checkInTime = new Date();

    await visitor.save();

    res.status(200).json({
      success: true,
      message: "Visitor checked in successfully",
      visitor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const checkOutVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);

    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: "Visitor not found",
      });
    }

    if (visitor.status !== "Checked-In") {
      return res.status(400).json({
        success: false,
        message: "Visitor is not checked in",
      });
    }

    visitor.status = "Checked-Out";
    visitor.checkOutTime = new Date();

    await visitor.save();

    res.status(200).json({
      success: true,
      message: "Visitor checked out successfully",
      visitor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createVisitor,
  getMyVisitors,
  getAllVisitors,
  approveVisitor,
  rejectVisitor,
  checkInVisitor,
  checkOutVisitor,
};