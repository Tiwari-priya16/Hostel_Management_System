import React, { useState, useEffect, useRef } from "react";
import {
  getCommunityMessages,
  sendCommunityMessage,
  deleteCommunityMessage,
  togglePinAnnouncement
} from "../../services/communityService";
import { compressAndResizeImage, uploadImageToCloudinary } from "../../services/uploadService";
import { toast } from "react-toastify";
import {
  FaBullhorn, FaThumbtack, FaPlus, FaTrash, FaUser,
  FaImage, FaCamera, FaTimes, FaSpinner, FaLock
} from "react-icons/fa";

function AnnouncementsChannel({ user, onImageClick }) {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);

  // Create Modal State (Admin)
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [attachmentPreview, setAttachmentPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const EMOJI_LIST = ["📢", "📌", "🚨", "⚠️", "💡", "🗓️", "🕒", "🎉", "💯", "ℹ️", "👏", "🙌"];

  const addEmoji = (emoji) => {
    setContent(prev => prev + emoji);
  };

  const galleryInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const isAuthorizedPoster = user?.role === "admin" || user?.role === "warden" || user?.role === "staff";

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await getCommunityMessages({ channelType: "announcement", limit: 100 });
      if (res.success) {
        setAnnouncements(res.messages || []);
      }
    } catch (error) {
      console.error("Fetch Announcements Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      toast.info("Compressing image...", { autoClose: 1200 });
      const compressed = await compressAndResizeImage(file);
      setSelectedFile(compressed);
      setAttachmentPreview(URL.createObjectURL(compressed));
    } catch (error) {
      toast.error(error.message || "Invalid image file");
      e.target.value = "";
    }
  };

  const removeAttachment = () => {
    setSelectedFile(null);
    setAttachmentPreview(null);
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    if (!content.trim() && !selectedFile) {
      return toast.warning("Announcement content or image is required");
    }

    try {
      setSubmitting(true);
      let imageUrl = "";

      if (selectedFile) {
        imageUrl = await uploadImageToCloudinary(selectedFile, "HostelSync/community");
      }

      const res = await sendCommunityMessage({
        channelType: "announcement",
        content: content.trim(),
        image: imageUrl,
      });

      if (res.success) {
        toast.success("Announcement published!");
        setContent("");
        removeAttachment();
        setShowCreateModal(false);
        fetchAnnouncements();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to publish announcement");
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePin = async (id) => {
    try {
      const res = await togglePinAnnouncement(id);
      toast.success(res.message);
      fetchAnnouncements();
    } catch (error) {
      toast.error("Failed to pin announcement");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) return;

    try {
      await deleteCommunityMessage(id);
      toast.success("Announcement deleted");
      setAnnouncements(prev => prev.filter(a => a._id !== id));
    } catch (error) {
      toast.error("Failed to delete announcement");
    }
  };

  return (
    <div className="channel-view-container">
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

      <div className="channel-view-header">
        <div>
          <h2>
            <FaBullhorn style={{ color: "#2563eb", marginRight: "10px" }} />
            Hostel Announcements
          </h2>
          <p>Official notices and updates from Hostel Administration</p>
        </div>

        {isAuthorizedPoster && (
          <button className="create-post-btn" onClick={() => setShowCreateModal(true)}>
            <FaPlus /> New Announcement
          </button>
        )}
      </div>

      {!isAuthorizedPoster && (
        <div className="info-banner">
          <FaLock style={{ color: "#2563eb" }} />
          <span>Announcements are read-only for students. Only Wardens and Admins can post announcements.</span>
        </div>
      )}

      {loading ? (
        <div className="empty-state-box">
          <FaSpinner className="spinner" style={{ fontSize: "30px" }} />
          <p>Loading announcements...</p>
        </div>
      ) : announcements.length === 0 ? (
        <div className="empty-state-box">
          <FaBullhorn style={{ fontSize: "40px", color: "var(--text-muted)", marginBottom: "10px" }} />
          <h3>No Announcements Yet</h3>
          <p>Official notices will appear here once published.</p>
        </div>
      ) : (
        <div className="announcements-feed-container">
          {announcements.map((item) => (
            <div key={item._id} className={`announcement-card ${item.isPinned ? "pinned" : ""}`}>
              {item.isPinned && (
                <div className="pinned-badge">
                  <FaThumbtack /> PINNED ANNOUNCEMENT
                </div>
              )}

              <div className="announcement-card-header">
                <div className="announcement-author-info">
                  {item.sender?.profilePic ? (
                    <img src={item.sender.profilePic} alt={item.sender.name} className="msg-avatar-img" />
                  ) : (
                    <div className="msg-default-avatar"><FaUser /></div>
                  )}
                  <div>
                    <strong style={{ color: "var(--text-primary)", fontSize: "15px" }}>{item.sender?.name}</strong>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)", display: "flex", gap: "8px", alignItems: "center" }}>
                      <span className="msg-tag-badge">
                        {item.sender?.role === "admin" ? "Super Admin" : item.sender?.role === "warden" ? `Warden (${item.sender?.hostelBlock || "Hostel"})` : "Warden / Staff"}
                      </span>
                      <span>•</span>
                      <span>{new Date(item.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</span>
                    </div>
                  </div>
                </div>

                {isAuthorizedPoster && (
                  <div className="announcement-admin-actions">
                    <button onClick={() => handleTogglePin(item._id)}>
                      <FaThumbtack /> {item.isPinned ? "Unpin" : "Pin"}
                    </button>
                    <button className="delete" onClick={() => handleDelete(item._id)}>
                      <FaTrash /> Delete
                    </button>
                  </div>
                )}
              </div>

              {item.content && <p className="announcement-card-body">{item.content}</p>}

              {item.image && (
                <img
                  src={item.image}
                  alt="Announcement Attachment"
                  className="announcement-card-image"
                  onClick={() => onImageClick(item.image, "Announcement Attachment")}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Admin Create Announcement Modal */}
      {showCreateModal && (
        <div className="photo-view-modal-overlay">
          <div className="photo-modal-card" style={{ maxWidth: "550px" }}>
            <div className="modal-header">
              <h3>Create Official Announcement</h3>
              <button className="close-btn" onClick={() => setShowCreateModal(false)}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleCreateAnnouncement}>
              <div className="quick-emoji-row">
                {EMOJI_LIST.map((e, idx) => (
                  <span key={idx} className="emoji-item" onClick={() => addEmoji(e)}>{e}</span>
                ))}
              </div>

              <textarea
                className="feedback-textarea"
                placeholder="Write announcement details..."
                rows="5"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                style={{ width: "100%", marginBottom: "15px" }}
                required
              />

              <div className="photo-attachment-section" style={{ marginBottom: "20px" }}>
                <label className="section-label">Attach Image (Optional)</label>
                {!attachmentPreview ? (
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
                      <FaCamera /> Camera
                    </button>
                  </div>
                ) : (
                  <div className="photo-preview-wrapper">
                    <img src={attachmentPreview} alt="Preview" className="complaint-preview-img" />
                    <button
                      type="button"
                      className="remove-photo-btn"
                      onClick={removeAttachment}
                    >
                      <FaTimes />
                    </button>
                  </div>
                )}
              </div>

              <div className="preview-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowCreateModal(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="upload-confirm-btn"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <FaSpinner className="spinner" /> Publishing...
                    </>
                  ) : (
                    "Publish Announcement"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AnnouncementsChannel;
