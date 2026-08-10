const { body } = require("express-validator");

exports.roomTransferValidation = [
  body("currentRoom")
    .notEmpty()
    .withMessage("Current room is required"),

  body("requestedRoom")
    .notEmpty()
    .withMessage("Requested room is required"),

  body("reason")
    .notEmpty()
    .withMessage("Reason is required"),
];