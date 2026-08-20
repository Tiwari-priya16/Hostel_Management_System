const mongoose = require("mongoose");

const messMenuSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      required: true,
      unique: true, // Monday, Tuesday, etc.
    },
    breakfast: {
      items: [String],
      startTime: { type: String, default: "08:00" },
      endTime: { type: String, default: "10:00" },
    },
    lunch: {
      items: [String],
      startTime: { type: String, default: "12:30" },
      endTime: { type: String, default: "14:30" },
    },
    dinner: {
      items: [String],
      startTime: { type: String, default: "20:00" },
      endTime: { type: String, default: "22:00" },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MessMenu", messMenuSchema);
