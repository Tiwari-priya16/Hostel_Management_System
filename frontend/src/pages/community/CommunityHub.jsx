import React, { useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import ChatChannel from "./ChatChannel";
import AnnouncementsChannel from "./AnnouncementsChannel";
import LostFoundChannel from "./LostFoundChannel";
import { FaComments, FaBullhorn, FaSearch, FaBuilding, FaTimes } from "react-icons/fa";
import "./Community.css";

function CommunityHub() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [activeTab, setActiveTab] = useState("general"); // general, announcement, lost_found, block
  const [selectedBlock, setSelectedBlock] = useState(user?.hostelBlock || "Block A");

  // Image Viewer Modal State
  const [viewerImage, setViewerImage] = useState(null); // { url, title }

  const handleOpenImageViewer = (url, title = "Community Photo") => {
    setViewerImage({ url, title });
  };

  const isAdminOrStaff = user?.role === "admin" || user?.role === "staff";

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="main-content">
        <Navbar />

        <div className="community-container">
          <div className="community-header">
            <h1>Community Hub</h1>

            {/* 4 Main Community Tabs */}
            <div className="channel-tabs">
              <button
                className={`tab-btn ${activeTab === "general" ? "active" : ""}`}
                onClick={() => setActiveTab("general")}
              >
                <FaComments /> General Chat
              </button>

              <button
                className={`tab-btn ${activeTab === "announcement" ? "active" : ""}`}
                onClick={() => setActiveTab("announcement")}
              >
                <FaBullhorn /> Announcements
              </button>

              <button
                className={`tab-btn ${activeTab === "lost_found" ? "active" : ""}`}
                onClick={() => setActiveTab("lost_found")}
              >
                <FaSearch /> Lost & Found
              </button>

              <button
                className={`tab-btn ${activeTab === "block" ? "active" : ""}`}
                onClick={() => setActiveTab("block")}
              >
                <FaBuilding />
                {isAdminOrStaff ? "Block Communities" : `${user?.hostelBlock || "My Block"} Community`}
              </button>
            </div>
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
