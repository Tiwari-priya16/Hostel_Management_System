import API from "./api";

export const getNotices = async () => {
  const res = await API.get("/notices");
  return res.data;
};

export const createNotice = async (data) => {
  const res = await API.post("/notices", data);
  return res.data;
};

export const deleteNotice = async (id) => {
  const res = await API.delete(`/notices/${id}`);
  return res.data;
};

export const getNoticeCount = async () => {
  const res = await API.get("/notices");
  return res.data.count;
};

