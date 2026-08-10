import API from "./api";

export const applyTransfer = async (data) => {
  const res = await API.post("/room-transfer", data);
  return res.data;
};

export const getMyTransfers = async () => {
  const res = await API.get("/room-transfer/my");
  return res.data;
};

export const getAllTransfers = async () => {
  const res = await API.get("/room-transfer");
  return res.data;
};

export const approveTransfer = async (id) => {
  const res = await API.put(
    `/room-transfer/${id}/approve`
  );
  return res.data;
};

export const rejectTransfer = async (id) => {
  const res = await API.put(
    `/room-transfer/${id}/reject`
  );
  return res.data;
};

export const getTransferAnalytics =
  async () => {
    const res = await API.get(
      "/room-transfer/analytics"
    );

    return res.data;
  };