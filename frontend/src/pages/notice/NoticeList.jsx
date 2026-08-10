import React, {
  useEffect,
  useState,
} from "react";

import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";

import { getNotices } from "../../services/noticeService";

function NoticeList() {
  const [notices, setNotices] =
    useState([]);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    const res =
      await getNotices();

    setNotices(
      res.notices || []
    );
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="content">
        <Navbar />

        <div className="notice-container">
          <h1>
            📢 Hostel Notices
          </h1>

          {notices.map(
            (notice) => (
              <div
                key={notice._id}
                className="notice-card"
              >
                <h3>
                  {notice.title}
                </h3>

                <p>
                  {notice.message}
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default NoticeList;