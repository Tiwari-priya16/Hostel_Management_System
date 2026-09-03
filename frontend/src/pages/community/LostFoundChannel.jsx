import React, { useState, useEffect, useRef } from "react";
import {
  getCommunityMessages,
  sendCommunityMessage,
  deleteCommunityMessage
} from "../../services/communityService";
import { compressAndResizeImage, uploadImageToCloudinary } from "../../services/uploadService";
import { toast } from "react-toastify";
import {
  FaSearch, FaPlus, FaTag, FaTrash, FaUser,
  FaImage, FaCamera, FaTimes, FaSpinner, FaClock
} from "react-icons/fa";

function LostFoundChannel({ user, onImageClick }) {
  const [items, setItems] = useState([]);
  const [filterTag, setFilterTag] = useState("ALL"); // ALL, LOST, FOUND
  const [loading, setLoading] = useState(false);

  // Post Modal State
  const [showModal, setShowModal] = useState(false);
  const [postTag, setPostTag] = useState("LOST"); // LOST or FOUND
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [attachmentPreview, setAttachmentPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const galleryInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  useEffect(() => {
    fetchItems();
  }, [filterTag]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await getCommunityMessages({
        channelType: "lost_found",
        lostFoundType: filterTag,
        limit: 100,
      });
      if (res.success) {
        setItems(res.messages || []);
      }
    } catch (error) {
      console.error("Fetch Lost & Found Error:", error);
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

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!description.trim() && !selectedFile) {
      return toast.warning("Description or photo is required");
    }

    try {
      setSubmitting(true);
      let imageUrl = "";

      if (selectedFile) {
        imageUrl = await uploadImageToCloudinary(selectedFile, "HostelSync/lost-found");
      }

      const res = await sendCommunityMessage({
        channelType: "lost_found",
        lostFoundType: postTag,
        content: description.trim(),
        image: imageUrl,
      });

      if (res.success) {
        toast.success(`Item posted as ${postTag}!`);
        setDescription("");
        removeAttachment();
        setShowModal(false);
        fetchItems();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to post item");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm("Delete this Lost & Found post?")) return;

    try {
      await deleteCommunityMessage(id);
      toast.success("Post deleted");
      setItems(prev => prev.filter(i => i._id !== id));
    } catch (error) {
      toast.error("Failed to delete post");
    }
  };

  return (
    <div>
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

      <div className="lost-found-filter-bar">
        <div>
          <h2 style={{ margin: 0, color: "var(--text-primary)" }}>
            <FaSearch style={{ color: "#2563eb", marginRight: "10px" }} />
            Lost & Found Desk
          </h2>
          <p style={{ margin: "5px 0 0", color: "var(--text-muted)", fontSize: "14px" }}>
            Report lost belongings or post items you found around the hostel campus
          </p>
        </div>

        <button className="create-post-btn" onClick={() => setShowModal(true)}>
          <FaPlus /> Report / Post Item
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px", flexWrap: "wrap", gap: "15px" }}>
        <div className="filter-pills">
          <button
            className={`filter-pill ${filterTag === "ALL" ? "active" : ""}`}
            onClick={() => setFilterTag("ALL")}
          >
            All Items
          </button>
          <button
            className={`filter-pill ${filterTag === "LOST" ? "active" : ""}`}
            onClick={() => setFilterTag("LOST")}
          >
            🔍 Lost Items
          </button>
          <button
            className={`filter-pill ${filterTag === "FOUND" ? "active" : ""}`}
            onClick={() => setFilterTag("FOUND")}
          >
            ✨ Found Items
          </button>
        </div>
      </div>

      {loading ? (
        <div className="empty-state-box">
          <FaSpinner className="spinner" style={{ fontSize: "30px" }} />
          <p>Loading items...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="empty-state-box">
          <FaSearch style={{ fontSize: "40px", color: "var(--text-muted)", marginBottom: "10px" }} />
          <h3>No Items Listed</h3>
          <p>No lost or found items found for this filter.</p>
        </div>
      ) : (
        <div className="lost-found-grid">
          {items.map((item) => {
            const isOwn = item.sender?._id === user?._id;
            const canDelete = isOwn || user?.role === "admin" || user?.role === "staff";

            return (
              <div key={item._id} className="lost-found-card">
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span className={`tag-badge ${item.lostFoundType}`}>
                      {item.lostFoundType === "LOST" ? "🔍 LOST" : "✨ FOUND"}
                    </span>

                    {canDelete && (
                      <button
                        className="msg-delete-btn"
                        title="Delete Post"
                        onClick={() => handleDeleteItem(item._id)}
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>

                  {item.image && (
                    <img
                      src={item.image}
                      alt="Lost & Found Item"
                      className="lost-found-card-img"
                      onClick={() => onImageClick(item.image, `${item.lostFoundType} Item`)}
                    />
                  )}

                  <p className="lost-found-content">{item.content}</p>
                </div>

                <div className="lost-found-footer">
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    {item.sender?.profilePic ? (
                      <img src={item.sender.profilePic} alt={item.sender.name} className="msg-avatar-img" style={{ width: "28px", height: "28px" }} />
                    ) : (
                      <div className="msg-default-avatar" style={{ width: "28px", height: "28px", fontSize: "14px" }}><FaUser /></div>
                    )}
                    <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-primary)" }}>
                      {item.sender?.name} ({item.sender?.hostelBlock}-{item.sender?.roomNumber})
                    </span>
                  </div>

                  <span style={{ fontSize: "11px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                    <FaClock /> {new Date(item.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Post Modal */}
      {showModal && (
        <div className="photo-view-modal-overlay">
          <div className="photo-modal-card" style={{ maxWidth: "520px" }}>
            <div className="modal-header">
              <h3>Post Lost & Found Item</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleCreatePost}>
              <div style={{ marginBottom: "18px" }}>
                <label className="section-label">Select Tag</label>
                <div style={{ display: "flex", gap: "15px", marginTop: "8px" }}>
                  <button
                    type="button"
                    className={`filter-pill ${postTag === "LOST" ? "active" : ""}`}
                    onClick={() => setPostTag("LOST")}
                    style={{ flex: 1, padding: "12px", background: postTag === "LOST" ? "#ef4444" : "var(--bg-primary)", color: postTag === "LOST" ? "white" : "var(--text-primary)", borderColor: postTag === "LOST" ? "#ef4444" : "var(--border-color)" }}
                  >
                    🔍 LOST ITEM
                  </button>

                  <button
                    type="button"
                    className={`filter-pill ${postTag === "FOUND" ? "active" : ""}`}
                    onClick={() => setPostTag("FOUND")}
                    style={{ flex: 1, padding: "12px", background: postTag === "FOUND" ? "#22c55e" : "var(--bg-primary)", color: postTag === "FOUND" ? "white" : "var(--text-primary)", borderColor: postTag === "FOUND" ? "#22c55e" : "var(--border-color)" }}
                  >
                    ✨ FOUND ITEM
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: "18px" }}>
                <label className="section-label">Details / Description</label>
                <textarea
                  className="feedback-textarea"
                  placeholder="Describe the item, where it was lost/found, and how to reach you..."
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ width: "100%" }}
                  required
                />
              </div>

              <div className="photo-attachment-section" style={{ marginBottom: "20px" }}>
                <label className="section-label">Attach Photo (Optional)</label>
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
                  onClick={() => setShowModal(false)}
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
                      <FaSpinner className="spinner" /> Posting...
                    </>
                  ) : (
                    "Publish Post"
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

export default LostFoundChannel;
