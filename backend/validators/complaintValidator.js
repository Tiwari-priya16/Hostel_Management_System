const validateComplaintStatus = (req, res, next) => {
  const allowedStatus = [
    "Pending",
    "In Progress",
    "Resolved",
    "Rejected",
  ];

  if (!allowedStatus.includes(req.body.status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid status",
    });
  }

  next();
};

module.exports = {
  validateComplaintStatus,
};