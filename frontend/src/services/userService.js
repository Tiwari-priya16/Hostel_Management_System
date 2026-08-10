import API from "./api";

export const getStudents = async () => {
  const res = await API.get("/auth/students");
  return res.data;
};

export const getStaff = async () => {
  const res = await API.get("/auth/staff");
  return res.data;
};