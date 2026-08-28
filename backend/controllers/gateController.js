const GatePass = require("../models/GatePass");
const User = require("../models/User");

const recordExit = async (req, res) => {
  try {
    const { reason } = req.body;
    const studentId = req.user._id;

    // Check if already outside
    const user = await User.findById(studentId);
    if (user.currentStatus === "Outside Hostel") {
      return res.status(400).json({ success: false, message: "You are already marked as Outside" });
    }

    // Create GatePass record
    await GatePass.create({
      student: studentId,
      reason,
      status: "OUT",
      exitTime: new Date()
    });

    // Update User status
    user.currentStatus = "Outside Hostel";
    await user.save();

    res.status(201).json({ success: true, message: "Exit recorded successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const recordEntry = async (req, res) => {
  try {
    const studentId = req.user._id;

    // Check if inside
    const user = await User.findById(studentId);
    if (user.currentStatus === "Inside Hostel") {
      return res.status(400).json({ success: false, message: "You are already marked as Inside" });
    }

    // Find the active OUT pass
    const activePass = await GatePass.findOne({ student: studentId, status: "OUT" }).sort({ createdAt: -1 });
    if (activePass) {
      activePass.status = "IN";
      activePass.entryTime = new Date();
      await activePass.save();
    }

    // Update User status
    user.currentStatus = "Inside Hostel";
    await user.save();

    res.json({ success: true, message: "Entry recorded successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMyHistory = async (req, res) => {
  try {
    const history = await GatePass.find({ student: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAdminStats = async (req, res) => {
  try {
    const totalInside = await User.countDocuments({ role: "student", currentStatus: "Inside Hostel" });
    const totalOutside = await User.countDocuments({ role: "student", currentStatus: "Outside Hostel" });

    const currentlyOutsideList = await User.find({ role: "student", currentStatus: "Outside Hostel" })
      .select("name roomNumber phone hostelBlock");

    // Get last exit details for those outside
    const enrichedList = await Promise.all(currentlyOutsideList.map(async (u) => {
      const lastExit = await GatePass.findOne({ student: u._id, status: "OUT" }).sort({ createdAt: -1 });
      return {
        ...u._doc,
        exitTime: lastExit?.exitTime,
        reason: lastExit?.reason
      };
    }));

    res.json({
      success: true,
      stats: { totalInside, totalOutside },
      outsideStudents: enrichedList
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllHistory = async (req, res) => {
  try {
    const history = await GatePass.find()
      .populate("student", "name roomNumber phone")
      .sort({ createdAt: -1 });
    res.json({ success: true, history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  recordExit,
  recordEntry,
  getMyHistory,
  getAdminStats,
  getAllHistory
};
