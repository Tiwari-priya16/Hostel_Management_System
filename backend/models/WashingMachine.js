const mongoose = require("mongoose");

const washingMachineSchema = new mongoose.Schema(
  {
    machineNumber: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    block: {
      type: String,
      required: true,
    },
    floor: {
      type: String,
    },
    location: {
      type: String,
    },
    status: {
      type: String,
      enum: ["FREE", "BOOKED", "IN_USE", "UNDER_SERVICE", "OUT_OF_SERVICE"],
      default: "FREE",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    maintenanceReason: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WashingMachine", washingMachineSchema);
