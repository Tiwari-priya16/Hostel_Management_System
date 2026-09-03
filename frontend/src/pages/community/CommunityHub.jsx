import React, { useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import ChatChannel from "./ChatChannel";
import AnnouncementsChannel from "./AnnouncementsChannel";
import LostFoundChannel from "./LostFoundChannel";
import {
  FaComments, FaBullhorn, FaSearch, FaBuilding,
  FaChevronRight, FaArrowLeft, FaTimes, FaUsers
} from "react-icons/fa";
import "./Community.css";

function CommunityHub() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [activeTab, setActiveTab] = useState("general"); // general, announcement, lost_found, block
  const [selectedBlock, setSelectedBlock] = useState(user?.hostelBlock || "Block A");

  // Mobile responsive view toggle (list vs chat pane)
  const [showMobileChat, setShowMobileChat] = useState(false);

  // Image Viewer Modal State
  const [viewerImage, setViewerImage] = useState(null); // { url, title }

  const handleOpenImageViewer = (url, title = "Community Photo") => {
    setViewerImage({ url, title });
  };

  const handleSelectChannel = (tabKey) => {
    setActiveTab(tabKey);
    setShowMobileChat(true); // On mobile, switch to chat pane view
  };

  const isAdminOrStaff = user?.role === "admin" || user?.role === "staff";

  // Channel List Data for WhatsApp-style Sidebar
  const channelsList = [
    {
      id: "general",
      title: "General Chat",
      subtitle: "Campus-wide student group chat",
      icon: <FaComments />,
      badge: "Group",
      colorClass: "wa-icon-general",
    },
    {
      id: "announcement",
      title: "Announcements",
      subtitle: "Official admin notices & updates",
      icon: <FaBullhorn />,
      badge: "Official",
      colorClass: "wa-icon-announcement",
    },
    {
      id: "lost_found",
      title: "Lost & Found",
      subtitle: "Report lost items or post found items",
      icon: <FaSearch />,
      badge: "Desk",
      colorClass: "wa-icon-lostfound",
    },
    {
      id: "block",
      title: isAdminOrStaff ? "Block Communities" : `${user?.hostelBlock || "Block A"} Community`,
      subtitle: isAdminOrStaff ? "Inspect block chats" : `Private group for ${user?.hostelBlock || "your block"}`,
      icon: <FaBuilding />,
      badge: user?.hostelBlock || "Block",
      colorClass: "wa-icon-block",
    },
  ];

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="main-content">
        <Navbar />

        <div className="community-page-wrapper">
          <div className="wa-community-card">

            {/* LEFT SIDEBAR: Vertical Channel List (WhatsApp-style) */}
            <div className={`wa-community-sidebar ${showMobileChat ? "hide-mobile" : ""}`}>
              <div className="wa-sidebar-header">
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <FaUsers style={{ color: "#2563eb", fontSize: "22px" }} />
                  <h2>Communities</h2>
                </div>
              </div>

              <div className="wa-channel-list">
                {channelsList.map((ch) => (
                  <div
                    key={ch.id}
                    className={`wa-channel-item ${activeTab === ch.id ? "active" : ""}`}
                    onClick={() => handleSelectChannel(ch.id)}
                  >
                    <div className={`wa-channel-icon ${ch.colorClass}`}>
                      {ch.icon}
                    </div>

                    <div className="wa-channel-info">
                      <div className="wa-title-row">
                        <h4>{ch.title}</h4>
                        <span className="wa-channel-badge">{ch.badge}</span>
                      </div>
                      <p>{ch.subtitle}</p>
                    </div>

                    <FaChevronRight className="wa-chevron-icon" />
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT PANE: Active Chat / Conversation View */}
            <div className={`wa-chat-pane ${!showMobileChat ? "hide-mobile" : ""}`}>

              {/* Mobile Back Button Header */}
              <div className="wa-mobile-back-header">
                <button className="wa-back-btn" onClick={() => setShowMobileChat(false)}>
                  <FaArrowLeft /> Back to Communities
                </button>
              </div>

              {/* Admin Block Selector for Block Community Tab */}
              {activeTab === "block" && isAdminOrStaff && (
                <div className="admin-block-selector">
                  <label>Select Hostel Block to Inspect:</label>
                  <select
                    value={selectedBlock}
                    onChange={(e) => setSelectedBlock(e.target.value)}
                  >
                    <option value="Block A">Block A</option>
                    <option value="Block B">Block B</option>
                    <option value="Block C">Block C</option>
                    <option value="Block D">Block D</option>
                  </select>
                </div>
              )}

              {/* Render Active Channel */}
              <div className="wa-pane-content">
                {activeTab === "general" && (
                  <ChatChannel
                    channelType="general"
                    user={user}
                    onImageClick={handleOpenImageViewer}
                  />
                )}

                {activeTab === "block" && (
                  <ChatChannel
                    channelType="block"
                    blockName={isAdminOrStaff ? selectedBlock : user?.hostelBlock}
                    user={user}
                    onImageClick={handleOpenImageViewer}
                  />
                )}

                {activeTab === "announcement" && (
                  <AnnouncementsChannel
                    user={user}
                    onImageClick={handleOpenImageViewer}
                  />
                )}

                {activeTab === "lost_found" && (
                  <LostFoundChannel
                    user={user}
                    onImageClick={handleOpenImageViewer}
                  />
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Full Image Viewer Modal */}
        {viewerImage && (
          <div className="photo-view-modal-overlay" onClick={() => setViewerImage(null)}>
            <div className="photo-view-modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="photo-view-header">
                <h3>{viewerImage.title}</h3>
                <button className="close-view-btn" onClick={() => setViewerImage(null)}>
                  <FaTimes />
                </button>
              </div>
              <div className="photo-view-body">
                <img src={viewerImage.url} alt="Full Resolution" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CommunityHub;
