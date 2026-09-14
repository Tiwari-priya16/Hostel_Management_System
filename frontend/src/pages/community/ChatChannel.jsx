import React, { useState, useEffect, useRef } from "react";
import {
  getCommunityMessages,
  sendCommunityMessage,
  deleteCommunityMessage
} from "../../services/communityService";
import { compressAndResizeImage, uploadImageToCloudinary } from "../../services/uploadService";
import { toast } from "react-toastify";
import {
  FaPaperPlane, FaImage, FaCamera, FaTimes, FaTrash,
  FaUser, FaSpinner, FaComments, FaSmile
} from "react-icons/fa";
import ConfirmModal from "../../components/ConfirmModal";
import Loader from "../../components/Loader";

function ChatChannel({ channelType, blockName, user, onImageClick }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [attachmentPreview, setAttachmentPreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [modalConfig, setModalConfig] = useState({ isOpen: false });

  const EMOJI_LIST = ["😀", "😂", "😊", "😍", "👍", "👎", "🔥", "🎉", "💯", "📌", "🔍", "💡", "👏", "🙌", "🙏", "🚀", "📍", "🏠", "🧼", "⚡", "☕", "📢", "❤️", "✨", "🎒", "🔑", "📱", "💻"];

  const addEmoji = (emoji) => {
    setInputText(prev => prev + emoji);
  };

  const messagesEndRef = useRef(null);
  const galleryInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 10000); // 10 second polling
    return () => clearInterval(interval);
  }, [channelType, blockName]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await getCommunityMessages({
        channelType,
        block: blockName,
        limit: 100,
      });
      if (res.success) {
        setMessages(res.messages || []);
      }
    } catch (error) {
      console.error("Fetch Chat Error:", error);
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
    if (galleryInputRef.current) galleryInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() && !selectedFile) return;

    try {
      setSending(true);
      let imageUrl = "";

      if (selectedFile) {
        imageUrl = await uploadImageToCloudinary(selectedFile, "HostelSync/community");
      }

      const res = await sendCommunityMessage({
        channelType,
        block: blockName,
        content: inputText.trim(),
        image: imageUrl,
      });

      if (res.success) {
        setInputText("");
        removeAttachment();
        fetchMessages();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleDeleteMessage = (id) => {
    setModalConfig({
      isOpen: true,
      title: "Delete Message",
      message: "Are you sure you want to delete this message?",
      confirmText: "Delete",
      type: "danger",
      onConfirm: async () => {
        try {
          await deleteCommunityMessage(id);
          toast.success("Message deleted");
          setMessages(prev => prev.filter(m => m._id !== id));
        } catch (error) {
          toast.error("Failed to delete message");
        }
        setModalConfig({ isOpen: false });
      },
      onCancel: () => setModalConfig({ isOpen: false })
    });
  };

  const formatTimestamp = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="chat-window-card">
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

      <div className="chat-header-bar">
        <h2>
          <FaComments style={{ color: "#2563eb" }} />
          {channelType === "general" ? "General Hostel Chat" : `${blockName || user.hostelBlock} Chat`}
        </h2>
        <span className="chat-header-info">{messages.length} messages</span>
      </div>

      <div className="chat-messages-area">
        {loading && messages.length === 0 ? (
          <Loader />
        ) : messages.length === 0 ? (
          <div className="empty-state-box" style={{ background: "transparent", border: "none" }}>
            <FaComments style={{ fontSize: "40px", color: "var(--text-muted)", marginBottom: "10px" }} />
            <h3>No messages yet</h3>
            <p>Be the first one to say hello to the community!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.sender?._id === user?._id;
            const isModerator = user?.role === "admin" || user?.role === "warden" || user?.role === "staff";

            // Warden/Staff can delete any message EXCEPT Super Admin's
            const canDelete = isOwn ||
              (user?.role === "admin") ||
              (isModerator && msg.sender?.role !== "admin");

            return (
              <div key={msg._id} className={`chat-message-row ${isOwn ? "own-message" : ""}`}>
                {msg.sender?.profilePic ? (
                  <img src={msg.sender.profilePic} alt={msg.sender.name} className="msg-avatar-img" />
                ) : (
                  <div className="msg-default-avatar"><FaUser /></div>
                )}

                <div className="msg-bubble-content">
                  <div className="msg-meta-header">
                    <span className="msg-sender-name">{isOwn ? "You" : msg.sender?.name}</span>
                    <span className="msg-tag-badge">
                      {msg.sender?.role === "admin" ? "Admin" : `${msg.sender?.hostelBlock || "Block"}-${msg.sender?.roomNumber || ""}`}
                    </span>
                  </div>

                  {msg.content && <p className="msg-text">{msg.content}</p>}

                  {msg.image && (
                    <div
                      className="msg-image-attachment"
                      onClick={() => onImageClick(msg.image, `Sent by ${msg.sender?.name}`)}
                    >
                      <img src={msg.image} alt="Attachment" />
                    </div>
                  )}

                  <div className="msg-footer">
                    <span className="msg-timestamp">{formatTimestamp(msg.createdAt)}</span>
                    {canDelete && (
                      <button
                        className="msg-delete-btn"
                        title="Delete Message"
                        onClick={() => handleDeleteMessage(msg._id)}
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Composer Bar */}
      <form className="chat-composer-bar" onSubmit={handleSendMessage}>
        {showEmojiPicker && (
          <div className="emoji-picker-popover">
            {EMOJI_LIST.map((emoji, idx) => (
              <span key={idx} className="emoji-item" onClick={() => addEmoji(emoji)}>
                {emoji}
              </span>
            ))}
          </div>
        )}

        {attachmentPreview && (
          <div className="attachment-preview-box">
            <img src={attachmentPreview} alt="Preview" />
            <button type="button" className="remove-attach-btn" onClick={removeAttachment}>
              <FaTimes />
            </button>
          </div>
        )}

        <div className="composer-row">
          <button
            type="button"
            className="icon-action-btn"
            title="Emoji Picker"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <FaSmile />
          </button>

          <input
            type="text"
            className="composer-input"
            placeholder="Type your message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />

          <div className="attach-btn-group">
            <button
              type="button"
              className="icon-action-btn"
              title="Upload from Gallery"
              onClick={() => galleryInputRef.current?.click()}
            >
              <FaImage />
            </button>
            <button
              type="button"
              className="icon-action-btn"
              title="Take Photo"
              onClick={() => cameraInputRef.current?.click()}
            >
              <FaCamera />
            </button>
          </div>

          <button
            type="submit"
            className="send-msg-btn"
            disabled={sending || (!inputText.trim() && !selectedFile)}
          >
            {sending ? <FaSpinner className="spinner" /> : <FaPaperPlane />}
          </button>
        </div>
      </form>
      <ConfirmModal {...modalConfig} />
    </div>
  );
}

export default ChatChannel;
