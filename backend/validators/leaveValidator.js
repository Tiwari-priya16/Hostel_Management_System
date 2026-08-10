const { body } = require("express-validator");

exports.createLeaveValidation = [
  body("reason")
    .notEmpty()
    .withMessage("Reason is required"),

  body("fromDate")
    .notEmpty()
    .withMessage("From date is required")
    .isISO8601()
    .withMessage("Invalid date"),

  body("toDate")
    .notEmpty()
    .withMessage("To date is required")
    .isISO8601()
    .withMessage("Invalid date"),
];