import API from "./api";

export const createFeedback = async (data) => {
  const res = await API.post("/feedback", data);
  return res.data;
};

export const getMyFeedback = async () => {
  const res = await API.get("/feedback/my");
  return res.data;
};

export const getAllFeedback = async () => {
  const res = await API.get("/feedback");
  return res.data;
};

export const getFeedbackAnalytics = async () => {
  const res = await API.get("/feedback/analytics");
  return res.data;
};