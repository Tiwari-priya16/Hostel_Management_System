import React, { useEffect, useState } from "react";

import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { toast } from "react-toastify";

import "../dashboard/dashboard.css";
import "../notice/Notice.css";

import {
  getNotices,
  createNotice,
  deleteNotice,
} from "../../services/noticeService";

function AdminNotice() {
  const [notices, setNotices] = useState([]);

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const res = await getNotices();
      setNotices(res.notices || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await createNotice({
        title,
        message,
      });

      setTitle("");
      setMessage("");

      fetchNotices();

      toast.success("Notice sent successfully");
    } catch (error) {
      toast.error("Failed to create notice");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this notice?")) return;

    try {
      await deleteNotice(id);
      fetchNotices();
      toast.success("Notice deleted");
    } catch (error) {
      toast.error("Failed to delete notice");
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="content">
        <Navbar />

        <div className="notice-container">
          <h1>📢 Manage Notices</h1>

          <form
            className="notice-form"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              placeholder="Notice Title"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              required
            />

            <textarea
              placeholder="Write Notice..."
              value={message}
              onChange={(e) =>
                setMessage(
                  e.target.value
                )
              }
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Notice"}
            </button>
          </form>

          <div className="notice-list">
            {notices.length === 0 ? (
              <p>No notices found.</p>
            ) : (
              notices.map((notice) => (
                <div
                  key={notice._id}
                  className="notice-card"
                >
                  <div className="notice-header">
                    <h3>{notice.title}</h3>

                    <span className="notice-date">
                      {new Date(
                        notice.createdAt
                      ).toLocaleDateString(
                        "en-IN"
                      )}
                    </span>
                  </div>

                  <p className="notice-message">
                    {notice.message}
                  </p>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      handleDelete(
                        notice._id
                      )
                    }
                  >
                    Delete Notice
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminNotice;