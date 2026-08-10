import API from "./api";



export const createLaundry = async (data) => {
  const res = await API.post("/laundry", data);
  return res.data;
};

export const getMyLaundry = async () => {
  const res = await API.get("/laundry/my");
  return res.data;
};

export const cancelLaundry = async (id) => {
  const res = await API.put(`/laundry/${id}/cancel`);
  return res.data;
};

export const getAllLaundry = async () => {
  const res = await API.get("/laundry");
  return res.data;
};

export const getLaundryAnalytics = async () => {
  const res = await API.get("/laundry/analytics");
  return res.data;
};

export const completeLaundry = async (
  id
) => {
  const res = await API.put(
    `/laundry/${id}/complete`
  );

  return res.data;
};

export const deleteLaundry =
  async (id) => {
    const res = await API.delete(
      `/laundry/${id}`
    );

    return res.data;
  };