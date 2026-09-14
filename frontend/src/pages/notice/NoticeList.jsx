import React, {
  useEffect,
  useState,
} from "react";

import Sidebar from "../../components/sidebar/sidebar";
import Navbar from "../../components/navbar/Navbar";
import Loader from "../../components/Loader";

import { getNotices } from "../../services/noticeService";

function NoticeList() {
  const [notices, setNotices] =
    useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const res =
        await getNotices();

      setNotices(
        res.notices || []
      );
    } catch (error) {
    } finally {
      setLoading(false);
    }
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

          {loading ? (
            <Loader />
          ) : notices.length === 0 ? (
            <p>No notices found.</p>
          ) : (
            notices.map(
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
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default NoticeList;