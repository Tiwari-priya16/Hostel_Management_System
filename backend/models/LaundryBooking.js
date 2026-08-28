const mongoose = require("mongoose");

const laundryBookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
    },
    machine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WashingMachine",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: String, // YYYY-MM-DD
      required: true,
    },
    startTime: {
      type: String, // HH:MM
      required: true,
    },
    endTime: {
      type: String, // HH:MM
      required: true,
    },
    status: {
      type: String,
      enum: ["BOOKED", "ACTIVE", "COMPLETED", "CANCELLED", "NO_SHOW"],
      default: "BOOKED",
    },
    startedAt: Date,
    completedAt: Date,
    cancelledAt: Date,
  },
  { timestamps: true }
);

// Extremely important: Prevent double booking for same machine, date, and time slot
laundryBookingSchema.index({ machine: 1, date: 1, startTime: 1 }, { unique: true });

module.exports = mongoose.model("LaundryBooking", laundryBookingSchema);
