const { body } = require("express-validator");

exports.createNoticeValidation = [
  body("title").notEmpty().withMessage("Title is required"),
  body("message").notEmpty().withMessage("Message is required"),
];