import React, { useState, useRef } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { updateUserProfile } from "../../services/userService";
import { compressAndResizeImage, uploadImageToCloudinary } from "../../services/uploadService";
import { toast } from "react-toastify";
import {
  FaUser, FaPhone, FaEnvelope, FaBuilding, FaDoorOpen, FaCamera, FaPen,
  FaImage, FaTrash, FaSpinner, FaTimes
} from "react-icons/fa";
import "./Profile.css";

function Profile() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    roomNumber: user?.roomNumber || "",
    hostelBlock: user?.hostelBlock || "",
  });

  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);

  const galleryInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle image selection from gallery or camera
  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setShowPhotoOptions(false);
      toast.info("Processing & compressing image...", { autoClose: 1500 });

      const compressedFile = await compressAndResizeImage(file);
      setSelectedFile(compressedFile);
      setPreviewUrl(URL.createObjectURL(compressedFile));
    } catch (error) {
      toast.error(error.message || "Failed to process image");
      e.target.value = "";
    }
  };

  // Upload previewed image to Cloudinary and update profile
  const handleUploadConfirm = async () => {
    if (!selectedFile) return;

    try {
      setUploadingPhoto(true);
      const imageUrl = await uploadImageToCloudinary(selectedFile, "HostelSync/profiles");

      const res = await updateUserProfile({ profilePic: imageUrl });
      if (res.success) {
        localStorage.setItem("user", JSON.stringify(res.user));
        setUser(res.user);
        toast.success("Profile photo updated successfully!");
        setPreviewUrl(null);
        setSelectedFile(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Photo upload failed");
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Remove existing profile photo
  const handleRemovePhoto = async () => {
    if (!window.confirm("Are you sure you want to remove your profile photo?")) return;

    try {
      setUploadingPhoto(true);
      const res = await updateUserProfile({ profilePic: "" });
      if (res.success) {
        localStorage.setItem("user", JSON.stringify(res.user));
        setUser(res.user);
        toast.success("Profile photo removed successfully!");
        setShowPhotoOptions(false);
      }
    } catch (error) {
      toast.error("Failed to remove profile photo");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const cancelPreview = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await updateUserProfile(formData);
      if (res.success) {
        localStorage.setItem("user", JSON.stringify(res.user));
        setUser(res.user);
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />

        {/* Hidden inputs for file selection */}
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
          capture="user"
          style={{ display: "none" }}
          onChange={handleFileSelect}
        />

        <div className="profile-container">
          <div className="profile-header-card">
            <div className="profile-avatar-section">
              <div className="avatar-container">
                <div className="avatar-circle">
                  {user?.profilePic ? (
                    <img src={user.profilePic} alt={user.name} className="profile-img" />
                  ) : (
                    <FaUser className="default-avatar" />
                  )}
                </div>

                <button
                  className="edit-avatar-btn"
                  title={user?.profilePic ? "Edit Profile Photo" : "Upload Profile Photo"}
                  onClick={() => setShowPhotoOptions(true)}
                  disabled={uploadingPhoto}
                >
                  {uploadingPhoto ? (
                    <FaSpinner className="spinner" />
                  ) : user?.profilePic ? (
                    <FaPen />
                  ) : (
                    <FaCamera />
                  )}
                </button>
              </div>

              <div className="profile-header-info">
                <h1>{user?.name}</h1>
                <span className="profile-role-badge">{user?.role}</span>
              </div>
            </div>
          </div>

          {/* Photo Options Modal */}
          {showPhotoOptions && (
            <div className="photo-modal-overlay">
              <div className="photo-modal-card">
                <div className="modal-header">
                  <h3>Profile Photo Options</h3>
                  <button className="close-btn" onClick={() => setShowPhotoOptions(false)}>
                    <FaTimes />
                  </button>
                </div>
                <div className="photo-options-grid">
                  <button
                    className="option-btn"
                    onClick={() => galleryInputRef.current?.click()}
                  >
                    <FaImage className="option-icon" />
                    <span>Choose from Gallery</span>
                  </button>

                  <button
                    className="option-btn"
                    onClick={() => cameraInputRef.current?.click()}
                  >
                    <FaCamera className="option-icon" />
                    <span>Take Photo with Camera</span>
                  </button>

                  {user?.profilePic && (
                    <button
                      className="option-btn remove-option"
                      onClick={handleRemovePhoto}
                    >
                      <FaTrash className="option-icon" />
                      <span>Remove Profile Photo</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Image Preview Modal */}
          {previewUrl && (
            <div className="photo-modal-overlay">
              <div className="photo-modal-card preview-card">
                <h3>Confirm Profile Photo</h3>
                <p>Preview your photo before saving</p>

                <div className="preview-container">
                  <img src={previewUrl} alt="Preview" className="preview-avatar" />
                </div>

                <div className="preview-actions">
                  <button
                    className="cancel-btn"
                    onClick={cancelPreview}
                    disabled={uploadingPhoto}
                  >
                    Cancel
                  </button>
                  <button
                    className="upload-confirm-btn"
                    onClick={handleUploadConfirm}
                    disabled={uploadingPhoto}
                  >
                    {uploadingPhoto ? (
                      <>
                        <FaSpinner className="spinner" /> Uploading...
                      </>
                    ) : (
                      "Save Photo"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="profile-grid">
            <div className="profile-form-card">
              <h3>Personal Information</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label><FaUser /> Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label><FaEnvelope /> Email Address</label>
                  <input type="email" value={user?.email} disabled className="disabled-input" />
                </div>

                <div className="form-group">
                  <label><FaPhone /> Phone Number</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
                </div>

                {user?.role === "student" && (
                  <div className="form-row">
                    <div className="form-group">
                      <label><FaBuilding /> Hostel Block</label>
                      <input type="text" name="hostelBlock" value={formData.hostelBlock} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label><FaDoorOpen /> Room No.</label>
                      <input type="text" name="roomNumber" value={formData.roomNumber} onChange={handleChange} />
                    </div>
                  </div>
                )}

                <button type="submit" className="update-profile-btn" disabled={loading}>
                  {loading ? "Updating..." : "Update Profile"}
                </button>
              </form>
            </div>

            <div className="profile-stats-card">
              <h3>Account Overview</h3>
              <div className="stat-item">
                <span>Member Since</span>
                <strong>{new Date(user?.createdAt).toLocaleDateString()}</strong>
              </div>
              <div className="stat-item">
                <span>Account Status</span>
                <strong className="status-active">Active</strong>
              </div>
              {user?.role === "student" && (
                <div className="stat-item">
                  <span>Current Floor</span>
                  <strong>{user?.roomNumber?.charAt(0) || "1"}st Floor</strong>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
