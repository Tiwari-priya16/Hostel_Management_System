import API from "./api";

export const createComplaint = (data) => {
  return API.post("/complaints", data);
};

export const getMyComplaints = () => {
  return API.get("/complaints/my");
};

export const getAllComplaints = () => {
  return API.get("/complaints");
};

export const getAssignedComplaints = () => {
  return API.get("/complaints/assigned");
};

export const getComplaintAnalytics = () => {
  return API.get("/complaints/analytics");
};

export const updateComplaintStatus = (
  id,
  status
) => {
  return API.put(
    `/complaints/${id}/status`,
    { status }
  );
};

export const deleteComplaint = (id) => {
  return API.delete(`/complaints/${id}`);
};