const mongoose = require("mongoose");

const maintenanceRequestSchema = new mongoose.Schema(
  {
    machine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WashingMachine",
      required: true,
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    issueType: {
      type: String,
      enum: ["Machine not starting", "Door problem", "Water leakage", "Excessive vibration", "Electrical problem", "Other"],
      required: true,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ["REPORTED", "UNDER_REVIEW", "UNDER_SERVICE", "RESOLVED"],
      default: "REPORTED",
    },
    resolvedAt: Date,
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MaintenanceRequest", maintenanceRequestSchema);
