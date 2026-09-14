const Notification = require("../models/Notification");
const User = require("../models/User");

const createNotification = async (recipientId, senderId, message, type) => {
  try {
    await Notification.create({
      recipient: recipientId,
      sender: senderId,
      message,
      type,
    });
  } catch (error) {
    console.error("Notification Error:", error);
  }
};

const notifyAdmins = async (senderId, message, type) => {
  try {
    // 1. Find the sender to get their hostel block
    const sender = await User.findById(senderId);
    const senderBlock = sender ? sender.hostelBlock : null;

    // 2. Find recipients: All Super Admins + Wardens/Staff of the sender's block
    const query = {
      $or: [
        { role: "admin" }, // All Super Admins
        { role: { $in: ["warden", "staff"] }, hostelBlock: senderBlock } // Relevant Block Staff
      ]
    };

    const staffMembers = await User.find(query);

    const notifications = staffMembers.map((staff) => ({
      recipient: staff._id,
      sender: senderId,
      message,
      type,
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }
  } catch (error) {
    console.error("Staff Notification Error:", error);
  }
};

const notifyAllStudents = async (senderId, message, type) => {
  try {
    const students = await User.find({ role: "student" });
    const notifications = students.map((student) => ({
      recipient: student._id,
      sender: senderId,
      message,
      type,
    }));
    await Notification.insertMany(notifications);
  } catch (error) {
    console.error("Student Notification Error:", error);
  }
};

module.exports = { createNotification, notifyAdmins, notifyAllStudents };
