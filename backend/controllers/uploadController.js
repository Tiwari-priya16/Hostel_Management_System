const { uploadToCloudinary, configureCloudinary, cloudinary } = require("../utils/cloudinary");

const uploadImage = async (req, res) => {
  try {
    let imageUrl = "";
    configureCloudinary();

    if (req.file) {
      // Check file size (2MB limit = 2 * 1024 * 1024 bytes)
      if (req.file.size > 2 * 1024 * 1024) {
        return res.status(400).json({
          success: false,
          message: "Image file size exceeds 2 MB limit",
        });
      }

      const folder = req.body.folder || "HostelSync/others";
      const result = await uploadToCloudinary(req.file.buffer, folder);
      imageUrl = result.secure_url;
    } else if (req.body.image) {
      // Handle base64 / data URL upload
      const base64String = req.body.image;

      // Calculate approximate base64 byte size
      const stringLength = base64String.length - (base64String.indexOf(',') + 1);
      const sizeInBytes = (stringLength * 3) / 4;

      if (sizeInBytes > 2 * 1024 * 1024) {
        return res.status(400).json({
          success: false,
          message: "Image file size exceeds 2 MB limit",
        });
      }

      const folder = req.body.folder || "HostelSync/others";
      const result = await cloudinary.uploader.upload(base64String, {
        folder: folder,
        transformation: [
          { width: 1200, height: 1200, crop: "limit", quality: "auto" }
        ],
      });
      imageUrl = result.secure_url;
    } else {
      return res.status(400).json({
        success: false,
        message: "No image file or data provided",
      });
    }

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      url: imageUrl,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to upload image to Cloudinary",
    });
  }
};

module.exports = {
  uploadImage,
};
