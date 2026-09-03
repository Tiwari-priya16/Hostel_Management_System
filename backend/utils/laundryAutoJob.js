const mongoose = require("mongoose");
const LaundryBooking = require("../models/LaundryBooking");
const WashingMachine = require("../models/WashingMachine");
const LaundrySettings = require("../models/LaundrySettings");
const { createNotification } = require("./notificationHelper");

const runLaundryAutomation = async () => {
  // Only run if MongoDB connection is active
  if (mongoose.connection.readyState !== 1) {
    return;
  }

  try {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const todayDate = now.toISOString().split('T')[0];

    const settings = await LaundrySettings.findOne() || { noShowGraceMinutes: 10 };

    // 1. Auto-Start Bookings (BOOKED -> ACTIVE)
    const bookingsToStart = await LaundryBooking.find({
      date: todayDate,
      startTime: { $lte: currentTime },
      status: "BOOKED"
    });

    for (const booking of bookingsToStart) {
      booking.status = "ACTIVE";
      booking.startedAt = new Date();
      await booking.save();

      // Update Machine status to IN_USE
      await WashingMachine.findByIdAndUpdate(booking.machine, { status: "IN_USE" });

      // Notify Student
      createNotification(booking.student, null, `Your washing machine slot has started!`, "laundry");
    }

    // 2. Auto-Complete Bookings (ACTIVE -> COMPLETED)
    const bookingsToComplete = await LaundryBooking.find({
      $or: [
        { date: todayDate, endTime: { $lte: currentTime }, status: "ACTIVE" },
        { date: { $lt: todayDate }, status: "ACTIVE" } // Handle overnight leftovers
      ]
    });

    for (const booking of bookingsToComplete) {
      booking.status = "COMPLETED";
      booking.completedAt = new Date();
      await booking.save();

      // Update Machine status to FREE
      await WashingMachine.findByIdAndUpdate(booking.machine, { status: "FREE" });

      // Notify Student
      createNotification(booking.student, null, `Your laundry slot is complete. Please collect your clothes.`, "laundry");
    }

    // 3. Handle No-Shows (Simulated logic: If status still BOOKED 10 mins after startTime)
    // In a real app, the user would click "Start Washing".
    // For this automation, we assume if it's already ACTIVE it's being used.
    // COMPLETED and CANCELLED are already handled.

  } catch (error) {
    console.error("Laundry Automation Error:", error);
  }
};

module.exports = runLaundryAutomation;
