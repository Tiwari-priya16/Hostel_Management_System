const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { protect } = require("../middleware/authMiddleware");
const { uploadImage } = require("../controllers/uploadController");

// Error handling wrapper for Multer errors
const handleMulterUpload = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || "File upload error",
      });
    }
    next();
  });
};

router.post("/", protect, handleMulterUpload, uploadImage);

module.exports = router;
