const mongoose = require("mongoose");

const messRatingSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mealType: {
      type: String,
      enum: ["breakfast", "lunch", "dinner"],
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
    date: {
      type: String, // YYYY-MM-DD
      required: true,
    },
  },
  { timestamps: true }
);

// Ensure a student can only rate a meal once per day
messRatingSchema.index({ student: 1, mealType: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("MessRating", messRatingSchema);
