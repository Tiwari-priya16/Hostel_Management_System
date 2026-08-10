const Feedback = require("../models/Feedback");

// Create Feedback
const createFeedback = async (req, res) => {
  try {
    const { foodQuality, cleanliness, taste, comment } = req.body;

    const feedback = await Feedback.create({
      student: req.user._id,
      foodQuality,
      cleanliness,
      taste,
      comment,
    });

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      feedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get My Feedback
const getMyFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({
      student: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: feedbacks.length,
      feedbacks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Feedback (Admin)
const getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate("student", "name email roomNumber")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: feedbacks.length,
      feedbacks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Analytics
const getFeedbackAnalytics = async (req, res) => {
  try {
    const total = await Feedback.countDocuments();

    const avgFood = await Feedback.aggregate([
      {
        $group: {
          _id: null,
          avg: { $avg: "$foodQuality" },
        },
      },
    ]);

    const avgCleanliness = await Feedback.aggregate([
      {
        $group: {
          _id: null,
          avg: { $avg: "$cleanliness" },
        },
      },
    ]);

    const avgTaste = await Feedback.aggregate([
      {
        $group: {
          _id: null,
          avg: { $avg: "$taste" },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      analytics: {
        total,
        averageFoodQuality: avgFood[0]?.avg || 0,
        averageCleanliness: avgCleanliness[0]?.avg || 0,
        averageTaste: avgTaste[0]?.avg || 0,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createFeedback,
  getMyFeedback,
  getAllFeedback,
  getFeedbackAnalytics,
};