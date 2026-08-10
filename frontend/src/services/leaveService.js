import API from "./api";

export const applyLeave = (data) => {
  return API.post("/leave", data);
};

export const getMyLeaves = () => {
  return API.get("/leave/my");
};

export const getAllLeaves = () => {
  return API.get("/leave");
};

export const approveLeave = (id) => {
  return API.put(`/leave/${id}/approve`);
};

export const rejectLeave = (id) => {
  return API.put(`/leave/${id}/reject`);
};

export const getLeaveAnalytics = () => {
  return API.get("/leave/analytics");
};