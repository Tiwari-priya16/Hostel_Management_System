const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["admin", "warden", "staff", "student"],
      default: "student",
    },

phone: {
  type: String,
  required: true,
},

roomNumber: {
  type: String,
  required: true,
  trim: true,
},

hostelBlock: {
  type: String,
  required: true,
  trim: true,
},

currentStatus: {
  type: String,
  enum: ["Inside Hostel", "Outside Hostel"],
  default: "Inside Hostel",
},

profilePic: {
  type: String,
  default: "",
},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);