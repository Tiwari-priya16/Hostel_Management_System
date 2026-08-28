import API from "./api";

export const recordExit = async (data) => {
  const res = await API.post("/gate/exit", data);
  return res.data;
};

export const recordEntry = async () => {
  const res = await API.post("/gate/entry");
  return res.data;
};

export const getMyGateHistory = async () => {
  const res = await API.get("/gate/my-history");
  return res.data;
};

export const getGateAdminStats = async () => {
  const res = await API.get("/gate/admin/stats");
  return res.data;
};

export const getAllGateHistory = async () => {
  const res = await API.get("/gate/admin/history");
  return res.data;
};
