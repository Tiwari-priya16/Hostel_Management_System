import API from "./api";

/**
 * Validates and compresses/resizes an image file if needed.
 * Ensures the image format is JPG, JPEG, or PNG and final size <= 2MB.
 * @param {File} file - The file selected by the user
 * @returns {Promise<File|Blob>} - Compressed file/blob
 */
export const compressAndResizeImage = (file) => {
  return new Promise((resolve, reject) => {
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!file || !validTypes.includes(file.type.toLowerCase())) {
      return reject(new Error("Please select a valid image file (JPG, JPEG, or PNG)."));
    }

    const maxSizeBytes = 2 * 1024 * 1024; // 2MB

    // If file is already under 2MB and small, we can still do a quick image load check
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        const maxWidth = 1200;
        const maxHeight = 1200;
        let width = img.width;
        let height = img.height;

        // Calculate aspect ratio resizing
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Export to blob with 0.82 quality
        const outputType = file.type.toLowerCase() === "image/png" ? "image/png" : "image/jpeg";
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return reject(new Error("Image processing failed."));
            }

            if (blob.size > maxSizeBytes) {
              return reject(
                new Error(
                  `Image file size (${(blob.size / (1024 * 1024)).toFixed(
                    2
                  )} MB) exceeds 2 MB limit even after compression. Please choose a smaller image.`
                )
              );
            }

            // Create a File object from Blob
            const compressedFile = new File([blob], file.name, {
              type: outputType,
              lastModified: Date.now(),
            });

            resolve(compressedFile);
          },
          outputType,
          0.82
        );
      };

      img.onerror = () => reject(new Error("Failed to load image file."));
    };

    reader.onerror = () => reject(new Error("Failed to read image file."));
  });
};

/**
 * Uploads an image file to the backend Cloudinary upload endpoint.
 * @param {File|Blob} file - The compressed image file
 * @param {String} folder - Optional folder name
 * @returns {Promise<String>} - Secure Cloudinary image URL
 */
export const uploadImageToCloudinary = async (file, folder = "hostelsync") => {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("folder", folder);

  const res = await API.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (res.data && res.data.success) {
    return res.data.url;
  } else {
    throw new Error(res.data?.message || "Failed to upload image");
  }
};
