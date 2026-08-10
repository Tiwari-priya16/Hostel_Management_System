const { body } = require("express-validator");

exports.createFeedbackValidator = [
  body("foodQuality")
    .isInt({ min: 1, max: 5 })
    .withMessage("Food quality rating must be 1-5"),

  body("cleanliness")
    .isInt({ min: 1, max: 5 })
    .withMessage("Cleanliness rating must be 1-5"),

  body("taste")
    .isInt({ min: 1, max: 5 })
    .withMessage("Taste rating must be 1-5"),

  body("comment")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Comment too long"),
];