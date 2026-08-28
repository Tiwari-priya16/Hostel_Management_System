const WashingMachine = require("../models/WashingMachine");
const LaundryBooking = require("../models/LaundryBooking");
const MaintenanceRequest = require("../models/MaintenanceRequest");
const LaundrySettings = require("../models/LaundrySettings");
const { createNotification, notifyAdmins } = require("../utils/notificationHelper");

// --- MACHINE MANAGEMENT ---

const getMachines = async (req, res) => {
  try {
    const machines = await WashingMachine.find();
    res.json({ success: true, machines });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addMachine = async (req, res) => {
  try {
    const machine = await WashingMachine.create(req.body);
    res.status(201).json({ success: true, machine });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateMachine = async (req, res) => {
  try {
    const machine = await WashingMachine.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, machine });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// --- BOOKING MANAGEMENT ---

const createBooking = async (req, res) => {
  try {
    const { machineId, date, slot } = req.body;
    const [startTime, endTime] = slot.split("-");

    // 1. Validate Machine
    const machine = await WashingMachine.findById(machineId);
    if (!machine || machine.status === "OUT_OF_SERVICE" || machine.status === "UNDER_SERVICE") {
      return res.status(400).json({ success: false, message: "Machine is not available for booking" });
    }

    // 2. Validate Student Booking Limit
    const settings = await LaundrySettings.findOne() || { maxActiveBookingsPerStudent: 1 };
    const activeBookings = await LaundryBooking.countDocuments({
      student: req.user._id,
      status: { $in: ["BOOKED", "ACTIVE"] }
    });
    if (activeBookings >= settings.maxActiveBookingsPerStudent) {
      return res.status(400).json({ success: false, message: `You already have ${activeBookings} active/upcoming booking(s).` });
    }

    // 3. Double Booking Check (using compound unique index in DB as safety, but checking here too)
    const existing = await LaundryBooking.findOne({ machine: machineId, date, startTime });
    if (existing) {
      return res.status(400).json({ success: false, message: "This slot is already booked by someone else." });
    }

    // 4. Create Booking
    const bookingCount = await LaundryBooking.countDocuments();
    const bookingId = `WM-${new Date().getFullYear()}-${1000 + bookingCount}`;

    const booking = await LaundryBooking.create({
      bookingId,
      machine: machineId,
      student: req.user._id,
      date,
      startTime,
      endTime,
      status: "BOOKED"
    });

    // Update Machine status to BOOKED only if it was FREE
    if (machine.status === "FREE") {
      await WashingMachine.findByIdAndUpdate(machineId, { status: "BOOKED" });
    }

    // Notify Admins
    notifyAdmins(req.user._id, `New Laundry Booking: ${bookingId} by ${req.user.name}`, "laundry");

    res.status(201).json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await LaundryBooking.find({ student: req.user._id })
      .populate("machine")
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await LaundryBooking.find()
      .populate("machine")
      .populate("student", "name email roomNumber")
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const booking = await LaundryBooking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    // Check ownership
    if (booking.student.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    booking.status = "CANCELLED";
    booking.cancelledAt = new Date();
    await booking.save();

    res.json({ success: true, message: "Booking cancelled successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- MAINTENANCE ---

const reportProblem = async (req, res) => {
  try {
    const { machineId, issueType, description } = req.body;
    const request = await MaintenanceRequest.create({
      machine: machineId,
      reportedBy: req.user._id,
      issueType,
      description
    });

    notifyAdmins(req.user._id, `Machine ${machineId} reported: ${issueType}`, "laundry");

    res.status(201).json({ success: true, request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMaintenanceRequests = async (req, res) => {
  try {
    const requests = await MaintenanceRequest.find()
      .populate("machine")
      .populate("reportedBy", "name email roomNumber")
      .sort({ createdAt: -1 });
    res.json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const resolveMaintenance = async (req, res) => {
  try {
    const request = await MaintenanceRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: "Request not found" });

    request.status = "RESOLVED";
    request.resolvedAt = new Date();
    request.resolvedBy = req.user._id;
    await request.save();

    // Reset machine status to FREE after repair
    await WashingMachine.findByIdAndUpdate(request.machine, { status: "FREE" });

    // Notify the student who reported it
    createNotification(request.reportedBy, null, `The issue you reported for Machine ${request.machine?.machineNumber || ''} has been resolved.`, "laundry");

    res.json({ success: true, message: "Issue marked as resolved" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- SETTINGS ---

const getSettings = async (req, res) => {
  try {
    let settings = await LaundrySettings.findOne();
    if (!settings) settings = await LaundrySettings.create({});
    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateSettings = async (req, res) => {
  try {
    const settings = await LaundrySettings.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json({ success: true, settings });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
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
};
