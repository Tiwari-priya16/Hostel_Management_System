const { validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstErrorMsg = errors.array()[0]?.msg || "Validation error";
    return res.status(400).json({
      success: false,
      message: firstErrorMsg,
      errors: errors.array(),
    });
  }

  next();
};

module.exports = validate;
