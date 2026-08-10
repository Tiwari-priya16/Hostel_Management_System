const Laundry = require("../models/Laundry");
const createLaundrySlot = async (req, res) => {
  try {
    const {
      machineNumber,
      slotDate,
      startTime,
      endTime,
    } = req.body;

    // Check duplicate booking
    const existingBooking = await Laundry.findOne({
      machineNumber,
      slotDate,
      startTime,
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: "Slot already booked",
      });
    }

    const booking = await Laundry.create({
      student: req.user._id,
      machineNumber,
      slotDate,
      startTime,
      endTime,
    });

    res.status(201).json({
      success: true,
      message: "Laundry slot booked successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Laundry.find({
      student: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const getAllBookings = async (req, res) => {
  try {
    const bookings = await Laundry.find()
      .populate("student", "name email roomNumber")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const booking = await Laundry.findByIdAndDelete(
      req.params.id
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Booking deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const booking = await Laundry.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    

    // Sirf owner hi cancel kar sake
    if (booking.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    booking.status = "Cancelled";
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const completeBooking = async (req, res) => {
  try {
    const booking = await Laundry.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    booking.status = "Completed";
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking completed successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getLaundryAnalytics = async (req, res) => {
  try {
    const total = await Laundry.countDocuments();

    const booked = await Laundry.countDocuments({
      status: "Booked",
    });

    const completed = await Laundry.countDocuments({
      status: "Completed",
    });

    const cancelled = await Laundry.countDocuments({
      status: "Cancelled",
    });

    res.status(200).json({
      success: true,
      analytics: {
        total,
        booked,
        completed,
        cancelled,
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
  createLaundrySlot,
  getMyBookings,
  getAllBookings,
  cancelBooking,
  completeBooking,
  getLaundryAnalytics,
  deleteBooking,
};