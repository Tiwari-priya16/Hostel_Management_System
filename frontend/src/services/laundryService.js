import API from "./api";

// Machines
export const getMachines = async () => {
  const res = await API.get("/laundry/machines");
  return res.data;
};

export const addMachine = async (data) => {
  const res = await API.post("/laundry/machines", data);
  return res.data;
};

export const updateMachine = async (id, data) => {
  const res = await API.put(`/laundry/machines/${id}`, data);
  return res.data;
};

// Bookings
export const createLaundryBooking = async (data) => {
  const res = await API.post("/laundry/bookings", data);
  return res.data;
};

export const getMyLaundryBookings = async () => {
  const res = await API.get("/laundry/bookings/my");
  return res.data;
};

export const getAllLaundryBookings = async () => {
  const res = await API.get("/laundry/bookings");
  return res.data;
};

export const cancelLaundryBooking = async (id) => {
  const res = await API.patch(`/laundry/bookings/${id}/cancel`);
  return res.data;
};

// Maintenance
export const reportMachineProblem = async (data) => {
  const res = await API.post("/laundry/maintenance", data);
  return res.data;
};

export const getMaintenanceRequests = async () => {
  const res = await API.get("/laundry/maintenance");
  return res.data;
};

export const resolveMaintenanceRequest = async (id) => {
  const res = await API.patch(`/laundry/maintenance/${id}/resolve`);
  return res.data;
};

// Settings
export const getLaundrySettings = async () => {
  const res = await API.get("/laundry/settings");
  return res.data;
};

export const updateLaundrySettings = async (data) => {
  const res = await API.put("/laundry/settings", data);
  return res.data;
};
