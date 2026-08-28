const mongoose = require("mongoose");

const gatePassSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    exitTime: {
      type: Date,
      default: Date.now,
    },
    entryTime: {
      type: Date,
    },
    reason: {
      type: String,
      enum: ["College", "Home", "Market", "Medical", "Other"],
      required: true,
    },
    status: {
      type: String,
      enum: ["OUT", "IN"],
      default: "OUT",
    },
    expectedReturn: {
      type: Date, // Optional: for flagging
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("GatePass", gatePassSchema);
