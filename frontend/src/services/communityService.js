import API from "./api";

/**
 * Fetch messages for a specific community channel
 * @param {Object} params - { channelType, block, lostFoundType, page, limit }
 */
export const getCommunityMessages = async (params) => {
  const res = await API.get("/community/messages", { params });
  return res.data;
};

/**
 * Post a message or item in a community channel
 * @param {Object} data - { channelType, content, image, lostFoundType, block }
 */
export const sendCommunityMessage = async (data) => {
  const res = await API.post("/community/messages", data);
  return res.data;
};

/**
 * Delete a community message/post by ID
 * @param {String} id - Message ID
 */
export const deleteCommunityMessage = async (id) => {
  const res = await API.delete(`/community/messages/${id}`);
  return res.data;
};

/**
 * Toggle pin status for an announcement (Admin only)
 * @param {String} id - Announcement ID
 */
export const togglePinAnnouncement = async (id) => {
  const res = await API.patch(`/community/messages/${id}/pin`);
  return res.data;
};
