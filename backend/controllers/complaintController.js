const Complaint = require("../models/Complaint");
const User = require("../models/User");
const { createNotification, notifyAdmins } = require("../utils/notificationHelper");

// Create Complaint
const createComplaint = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      photo,
    } = req.body;

    const user = await User.findById(
      req.user._id
    );

    const complaint = await Complaint.create({
      title,
      description,
      category,
      photo: photo || "",
      roomNumber: user.roomNumber,
      raisedBy: req.user._id,
    });

    // Notify Admins (Async)
    notifyAdmins(req.user._id, `New complaint raised: ${title}`, "complaint");

    res.status(201).json({
      success: true,
      message:
        "Complaint created successfully",
      complaint,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      raisedBy: req.user._id,
    })
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("raisedBy", "name email roomNumber")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateComplaintStatus = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    complaint.status = req.body.status;

    if (req.body.resolutionPhoto !== undefined) {
      complaint.resolutionPhoto = req.body.resolutionPhoto;
    }

    if (req.body.resolutionNote !== undefined) {
      complaint.resolutionNote = req.body.resolutionNote;
    }

    await complaint.save();

    // Notify Student (Async)
    createNotification(
      complaint.raisedBy,
      req.user._id,
      `Your complaint "${complaint.title}" status has been updated to ${req.body.status}`,
      "complaint"
    );

    res.status(200).json({
      success: true,
      message: "Status updated",
      complaint,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const assignStaff = async (req, res) => {
  try {
    const { staffId } = req.body;

    const complaint = await Complaint.findById(
      req.params.id
    );

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    complaint.assignedTo = staffId;
    complaint.status = "In Progress";

    await complaint.save();

    res.status(200).json({
      success: true,
      message: "Staff assigned successfully",
      complaint,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAssignedComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      assignedTo: req.user._id,
    })
      .populate("raisedBy", "name email roomNumber")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(
      req.params.id
    );

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    await complaint.deleteOne();

    res.status(200).json({
      success: true,
      message: "Complaint deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getComplaintAnalytics = async (req, res) => {
  try {
    const total = await Complaint.countDocuments();

    const pending = await Complaint.countDocuments({
      status: "Pending",
    });

    const inProgress = await Complaint.countDocuments({
      status: "In Progress",
    });

    const resolved = await Complaint.countDocuments({
      status: "Resolved",
    });

    const rejected = await Complaint.countDocuments({
      status: "Rejected",
    });

    res.status(200).json({
      success: true,
      analytics: {
        total,
        pending,
        inProgress,
        resolved,
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

module.exports = {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  updateComplaintStatus,
  assignStaff,
  getAssignedComplaints,
  getComplaintAnalytics,
  deleteComplaint,
};