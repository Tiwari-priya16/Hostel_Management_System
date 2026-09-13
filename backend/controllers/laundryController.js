const WashingMachine = require("../models/WashingMachine");
const LaundryBooking = require("../models/LaundryBooking");
const MaintenanceRequest = require("../models/MaintenanceRequest");
const LaundrySettings = require("../models/LaundrySettings");
const { createNotification, notifyAdmins } = require("../utils/notificationHelper");

// Helper to auto-complete expired past bookings
const cleanupPastBookings = async () => {
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const todayDate = now.toISOString().split('T')[0];

  await LaundryBooking.updateMany(
    {
      status: { $in: ["BOOKED", "ACTIVE"] },
      $or: [
        { date: { $lt: todayDate } },
        { date: todayDate, endTime: { $lte: currentTime } }
      ]
    },
    { $set: { status: "COMPLETED", completedAt: now } }
  );
};

// --- MACHINE MANAGEMENT ---

const getMachines = async (req, res) => {
  try {
    await cleanupPastBookings();

    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const todayDate = now.toISOString().split('T')[0];

    const machines = await WashingMachine.find();

    // Machine-level live status check (IN_USE only if currently running right now)
    for (let machine of machines) {
      if (machine.status !== "UNDER_SERVICE" && machine.status !== "OUT_OF_SERVICE") {
        const liveBooking = await LaundryBooking.findOne({
          machine: machine._id,
          date: todayDate,
          startTime: { $lte: currentTime },
          endTime: { $gt: currentTime },
          status: { $in: ["BOOKED", "ACTIVE"] }
        });

        const newStatus = liveBooking ? "IN_USE" : "FREE";
        if (machine.status !== newStatus) {
          machine.status = newStatus;
          await machine.save();
        }
      }
    }

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

// Get booked slots for a specific machine and date
const getMachineBookedSlots = async (req, res) => {
  try {
    await cleanupPastBookings();
    const { machineId } = req.params;
    const { date } = req.query;

    const bookings = await LaundryBooking.find({
      machine: machineId,
      date: date,
      status: { $in: ["BOOKED", "ACTIVE"] }
    });

    const bookedSlots = bookings.map(b => `${b.startTime}-${b.endTime}`);
    res.json({ success: true, bookedSlots });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- BOOKING MANAGEMENT ---

const createBooking = async (req, res) => {
  try {
    await cleanupPastBookings();
    const { machineId, date, slot } = req.body;
    const [startTime, endTime] = slot.split("-");

    const now = new Date();
    const todayDate = now.toISOString().split('T')[0];
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // 1. Validate Date (Only today or tomorrow within 24 hours)
    if (date < todayDate) {
      return res.status(400).json({ success: false, message: "Cannot book slots for past dates." });
    }

    // 2. Validate Slot Time (If today, cannot book past hours)
    if (date === todayDate && endTime <= currentTime) {
      return res.status(400).json({ success: false, message: "This time slot has already passed for today." });
    }

    // 3. Validate Machine Status
    const machine = await WashingMachine.findById(machineId);
    if (!machine || machine.status === "OUT_OF_SERVICE" || machine.status === "UNDER_SERVICE") {
      return res.status(400).json({ success: false, message: "Machine is under maintenance or out of service." });
    }

    // 4. Validate Student Active Booking Limit
    const settings = await LaundrySettings.findOne() || { maxActiveBookingsPerStudent: 1 };
    const activeBookings = await LaundryBooking.countDocuments({
      student: req.user._id,
      status: { $in: ["BOOKED", "ACTIVE"] },
      $or: [
        { date: { $gt: todayDate } },
        { date: todayDate, endTime: { $gt: currentTime } }
      ]
    });
    if (activeBookings >= settings.maxActiveBookingsPerStudent) {
      return res.status(400).json({ success: false, message: `You already have ${activeBookings} active/upcoming booking(s).` });
    }

    // 5. Double Booking Check for specific slot
    const existing = await LaundryBooking.findOne({
      machine: machineId,
      date,
      startTime,
      status: { $in: ["BOOKED", "ACTIVE"] }
    });

    if (existing) {
      return res.status(400).json({ success: false, message: "This specific time slot is already booked by another student." });
    }

    // 6. Create Booking
    const bookingCount = await LaundryBooking.countDocuments();
    const bookingId = `WM-${new Date().getFullYear()}-${1000 + bookingCount}`;

    // Check if slot starts right now
    const isRunningNow = (date === todayDate && startTime <= currentTime && endTime > currentTime);

    const booking = await LaundryBooking.create({
      bookingId,
      machine: machineId,
      student: req.user._id,
      date,
      startTime,
      endTime,
      status: isRunningNow ? "ACTIVE" : "BOOKED",
      startedAt: isRunningNow ? now : undefined
    });

    if (isRunningNow) {
      machine.status = "IN_USE";
      await machine.save();
    }

    // Notify Student
    createNotification(req.user._id, null, `Your washing machine booking for Machine ${machine.machineNumber} (${slot}) is confirmed!`, "laundry");

    // Notify Admins
    notifyAdmins(req.user._id, `New Laundry Booking: ${bookingId} by ${req.user.name}`, "laundry");

    res.status(201).json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMyBookings = async (req, res) => {
  try {
    await cleanupPastBookings();

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
    await cleanupPastBookings();

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
    if (booking.student.toString() !== req.user._id.toString() && req.user.role !== "admin" && req.user.role !== "warden" && req.user.role !== "staff") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    booking.status = "CANCELLED";
    booking.cancelledAt = new Date();
    await booking.save();

    // Re-check machine live status
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const todayDate = now.toISOString().split('T')[0];

    const liveBooking = await LaundryBooking.findOne({
      machine: booking.machine,
      date: todayDate,
      startTime: { $lte: currentTime },
      endTime: { $gt: currentTime },
      status: { $in: ["BOOKED", "ACTIVE"] }
    });

    const machine = await WashingMachine.findById(booking.machine);
    if (machine && machine.status !== "UNDER_SERVICE" && machine.status !== "OUT_OF_SERVICE") {
      machine.status = liveBooking ? "IN_USE" : "FREE";
      await machine.save();
    }

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
  getMachineBookedSlots,
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
