const mongoose = require("mongoose");

const communityMessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    channelType: {
      type: String,
      enum: ["general", "block", "announcement", "lost_found"],
      required: true,
    },
    block: {
      type: String, // e.g. "Block A", "Block B" (used when channelType === "block")
      trim: true,
      default: "",
    },
    content: {
      type: String,
      trim: true,
      default: "",
    },
    image: {
      type: String, // Cloudinary image URL
      default: "",
    },
    lostFoundType: {
      type: String,
      enum: ["LOST", "FOUND", null],
      default: null,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast query filtering
communityMessageSchema.index({ channelType: 1, block: 1, createdAt: -1 });
communityMessageSchema.index({ channelType: 1, lostFoundType: 1, createdAt: -1 });

module.exports = mongoose.model("CommunityMessage", communityMessageSchema);
