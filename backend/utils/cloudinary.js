const cloudinary = require("cloudinary").v2;

/**
 * Ensures Cloudinary is configured with latest environment variables
 */
const configureCloudinary = () => {
  // Ensure dotenv is loaded if process.env isn't populated yet
  if (!process.env.CLOUDINARY_CLOUD_NAME && require("dotenv")) {
    require("dotenv").config();
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  return cloudinary;
};

/**
 * Uploads a file buffer to Cloudinary
 * @param {Buffer} fileBuffer - The memory buffer of the uploaded file
 * @param {String} folder - Folder name in Cloudinary
 * @returns {Promise<Object>} Cloudinary upload result
 */
const uploadToCloudinary = (fileBuffer, folder = "HostelSync/others") => {
  return new Promise((resolve, reject) => {
    configureCloudinary();

    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return reject(new Error("Cloudinary credentials (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) are missing or not set in backend .env file"));
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        transformation: [
          { width: 1200, height: 1200, crop: "limit", quality: "auto" }
        ],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    uploadStream.end(fileBuffer);
  });
};

module.exports = {
  cloudinary,
  configureCloudinary,
  uploadToCloudinary,
};
