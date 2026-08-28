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
    const admins = await User.find({ role: "admin" });
    const notifications = admins.map((admin) => ({
      recipient: admin._id,
      sender: senderId,
      message,
      type,
    }));
    await Notification.insertMany(notifications);
  } catch (error) {
    console.error("Admin Notification Error:", error);
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
