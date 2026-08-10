const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    foodQuality: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    cleanliness: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    taste: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);