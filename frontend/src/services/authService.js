import API from "./api";

export const loginUser = (data) => {
  return API.post("/auth/login", data);
};

export const registerUser = (data) => {
  return API.post("/auth/register", data);
};

export const forgotPassword = (data) => {
  return API.post("/auth/forgot-password", data);
};

export const resetPassword = (data) => {
  return API.post("/auth/reset-password", data);
};

export const getPendingApprovals = () => {
  return API.get("/auth/pending-approvals");
};

export const approveUser = (id) => {
  return API.put(`/auth/approve/${id}`);
};

export const rejectUser = (id) => {
  return API.put(`/auth/reject/${id}`);
};
