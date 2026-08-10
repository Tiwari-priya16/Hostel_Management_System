const validateLaundryBooking = (req, res, next) => {
  const {
    machineNumber,
    slotDate,
    startTime,
    endTime,
  } = req.body;

  if (
    !machineNumber ||
    !slotDate ||
    !startTime ||
    !endTime
  ) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  if (machineNumber <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid machine number",
    });
  }

  next();
};

module.exports = {
  validateLaundryBooking,
};