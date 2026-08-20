import API from "./api";

export const getWeeklyMenu = async () => {
  const res = await API.get("/mess/menu");
  return res.data;
};

export const updateMessMenu = async (menuData) => {
  const res = await API.post("/mess/menu/update", menuData);
  return res.data;
};

export const submitMealRating = async (ratingData) => {
  const res = await API.post("/mess/rate", ratingData);
  return res.data;
};

export const getTodayMessRatings = async (date) => {
  const res = await API.get(`/mess/ratings?date=${date}`);
  return res.data;
};
