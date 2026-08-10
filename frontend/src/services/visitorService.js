import API from "./api";

export const createVisitor = async (data) => {
  const res = await API.post("/visitors", data);
  return res.data;
};

export const getMyVisitors = async () => {
  const res = await API.get("/visitors/my");
  return res.data;
};

export const getAllVisitors = async () => {
  const res = await API.get("/visitors");
  return res.data;
};

export const approveVisitor = async (id) => {
  const res = await API.put(`/visitors/${id}/approve`);
  return res.data;
};

export const rejectVisitor = async (id) => {
  const res = await API.put(`/visitors/${id}/reject`);
  return res.data;
};