import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";

import { createComplaint } from "../../services/complaintService";
import { compressAndResizeImage, uploadImageToCloudinary } from "../../services/uploadService";
import { toast } from "react-toastify";
import { FaCamera, FaImage, FaTrash, FaSpinner, FaTimes } from "react-icons/fa";

import "../dashboard/dashboard.css";
import "./RaiseComplaint.css";

function RaiseComplaint() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Other",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadStatusText, setUploadStatusText] = useState("");

  const galleryInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      toast.info("Processing & compressing image...", { autoClose: 1500 });
      const compressedFile = await compressAndResizeImage(file);
      setSelectedFile(compressedFile);
      setPreviewUrl(URL.createObjectURL(compressedFile));
    } catch (error) {
      toast.error(error.message || "Failed to process image");
      e.target.value = "";
    }
  };

  const removeSelectedPhoto = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (galleryInputRef.current) galleryInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      let photoUrl = "";

      if (selectedFile) {
        setUploadStatusText("Uploading photo to Cloudinary...");
        photoUrl = await uploadImageToCloudinary(selectedFile, "HostelSync/complaints");
      }

      setUploadStatusText("Submitting complaint...");
      await createComplaint({
        ...formData,
        photo: photoUrl,
      });

      toast.success("Complaint submitted successfully!");

      setFormData({
        title: "",
        description: "",
        category: "Other",
      });
      setSelectedFile(null);
      setPreviewUrl(null);

      navigate("/my-complaints");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to raise complaint");
    } finally {
      setLoading(false);
      setUploadStatusText("");
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="content">
        <Navbar />

        {/* Hidden File Inputs */}
        <input
          type="file"
          ref={galleryInputRef}
          accept="image/png, image/jpeg, image/jpg"
          style={{ display: "none" }}
          onChange={handleFileSelect}
        />
        <input
          type="file"
          ref={cameraInputRef}
          accept="image/png, image/jpeg, image/jpg"
          capture="environment"
          style={{ display: "none" }}
          onChange={handleFileSelect}
        />

        <div className="complaint-container">
          <div className="complaint-card">

            <h1>Raise Complaint</h1>

            <form onSubmit={handleSubmit}>

              <input
                type="text"
                name="title"
                placeholder="Complaint Title (e.g., Water Leakage)"
                value={formData.title}
                onChange={handleChange}
                required
              />

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="Water">Water</option>
                <option value="Electricity">Electricity</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Internet">Internet</option>
                <option value="Furniture">Furniture</option>
                <option value="Other">Other</option>
              </select>

              <textarea
                name="description"
                placeholder="Describe your issue in detail..."
                rows="4"
                value={formData.description}
                onChange={handleChange}
                required
              />

              {/* Optional Photo Attachment Section */}
              <div className="photo-attachment-section">
                <label className="section-label">Attachment (Optional Evidence Photo)</label>

                {!previewUrl ? (
                  <div className="photo-choice-buttons">
                    <button
                      type="button"
                      className="photo-choice-btn"
                      onClick={() => galleryInputRef.current?.click()}
                    >
                      <FaImage /> Gallery
                    </button>
                    <button
                      type="button"
                      className="photo-choice-btn"
                      onClick={() => cameraInputRef.current?.click()}
                    >
                      <FaCamera /> Take Photo
                    </button>
                  </div>
                ) : (
                  <div className="photo-preview-wrapper">
                    <img src={previewUrl} alt="Complaint Evidence" className="complaint-preview-img" />
                    <button
                      type="button"
                      className="remove-photo-btn"
                      onClick={removeSelectedPhoto}
                      title="Remove Photo"
                    >
                      <FaTimes />
                    </button>
                  </div>
                )}
              </div>

              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? (
                  <>
                    <FaSpinner className="spinner" /> {uploadStatusText || "Submitting..."}
                  </>
                ) : (
                  "Submit Complaint"
                )}
              </button>

              <button
                type="button"
                className="secondary-btn"
                onClick={() => navigate("/my-complaints")}
              >
                View My Complaints
              </button>

            </form>

          </div>
        </div>
      </div>
    </div>
  );
}

export default RaiseComplaint;
