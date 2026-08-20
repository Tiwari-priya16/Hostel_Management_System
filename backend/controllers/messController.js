const MessMenu = require("../models/MessMenu");
const MessRating = require("../models/MessRating");

// Pre-defined menu data from image
const defaultMenu = [
  {
    day: "Monday",
    breakfast: { items: ["Paratha", "Aalu chana", "Cornflakes", "Tea", "Banana"] },
    lunch: { items: ["Yellow Dal (Arhar)", "Rice", "Roti", "Sabji", "Bhujia", "Salad", "Pickle", "Seasonal Fruit"] },
    dinner: { items: ["Dal (Sabut Mung)", "Veg Pulao", "Roti", "Shahi Paneer", "Raita"] }
  },
  {
    day: "Tuesday",
    breakfast: { items: ["Poha", "Sweet Daliya (Milk)", "Bread", "Butter/Jam", "Sprouts", "Banana", "Tea"] },
    lunch: { items: ["Rajma", "Rice", "Roti", "Sabji", "Bhujiya", "Salad", "Pickles", "Seasonal Fruit"] },
    dinner: { items: ["Yellow Dal (Arhar)", "Sabji", "Rice", "Roti", "Kheer", "Salad"] }
  },
  {
    day: "Wednesday",
    breakfast: { items: ["Idli sambhar", "Coconut Chutney", "Bread", "Butter/Jam", "Cornflakes", "Banana", "Tea"] },
    lunch: { items: ["Yellow Dal (Arhar)", "Rice", "Roti", "Mix veg", "Bhujiya", "Salad", "Pickles", "Seasonal Fruit"] },
    dinner: { items: ["Dal (Makhni)", "Sabji/Bhujiya", "Rice", "Roti", "Sweet (01 rasogulla + 01 gulab jamun)"] }
  },
  {
    day: "Thursday",
    breakfast: { items: ["Aalu Paratha", "Plain Curd", "Bread", "Butter/Jam", "Sprouts", "Banana", "Tea", "Picle"] },
    lunch: { items: ["Chana Dal", "Rice", "Roti", "Kofta (Lauki)", "Onion Pakoda", "Papad", "Salad", "Pickles", "Seasonal Fruit"] },
    dinner: { items: ["Arhar Daal Tadka", "Rice", "Puri", "Mutter Paneer", "Raita"] }
  },
  {
    day: "Friday",
    breakfast: { items: ["Puri", "Black Chana", "Halwa", "Sprouts", "Banana", "Coffee"] },
    lunch: { items: ["Kadhi Pakaura", "Rice", "Roti", "Sabji", "Bhujiya", "Salad", "Pickles", "Seasonal Fruit"] },
    dinner: { items: ["Sabut Masoor Daal (Chilka Wala)", "Mix veg", "Rice", "Roti", "Sewai"] }
  },
  {
    day: "Saturday",
    breakfast: { items: ["Chole Bhatura", "Cornflakes", "Bread", "Butter/Jam", "Sprouts", "Pickles", "Banana", "Coffee"] },
    lunch: { items: ["Sabji", "Rice", "Roti", "Yellow Daal (Arhar)", "Papad", "Salad", "Pickles", "Seasonal Fruit"] },
    dinner: { items: ["Veg Biryani", "Raita", "Roti", "Chana Dal Tadka", "Veg Manchurian", "Ice-Cream / Hot Gulab Jamun"] }
  },
  {
    day: "Sunday",
    breakfast: { items: ["Masala Dosa/Uttapam", "Sambar", "Coconut Chutney", "Sprouts", "Banana", "Tea"] },
    lunch: { items: ["Kadhi Pakaura", "Rice", "Roti", "Sabji", "Bhujiya", "Papad", "Salad", "Pickles", "Seasonal Fruit"] },
    dinner: { items: ["Jeera Rice", "Poori", "Paneer Butter Masala", "Chhole", "Halwa", "Raita"] }
  }
];

const seedMenu = async (req, res) => {
  try {
    await MessMenu.deleteMany();
    await MessMenu.insertMany(defaultMenu);
    res.json({ success: true, message: "Menu seeded successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getWeeklyMenu = async (req, res) => {
  try {
    let menu = await MessMenu.find();
    if (menu.length === 0) {
      menu = await MessMenu.insertMany(defaultMenu);
    }
    res.json({ success: true, menu });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateMenu = async (req, res) => {
  try {
    const { day, breakfast, lunch, dinner } = req.body;
    const menu = await MessMenu.findOneAndUpdate(
      { day },
      { breakfast, lunch, dinner },
      { new: true, upsert: true }
    );
    res.json({ success: true, menu });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const submitRating = async (req, res) => {
  try {
    const { mealType, rating, date } = req.body;
    const student = req.user._id;

    const existingRating = await MessRating.findOne({ student, mealType, date });
    if (existingRating) {
      return res.status(400).json({ success: false, message: "You have already rated this meal today" });
    }

    const newRating = await MessRating.create({ student, mealType, rating, date });
    res.status(201).json({ success: true, rating: newRating });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getTodayRatings = async (req, res) => {
  try {
    const { date } = req.query;
    const ratings = await MessRating.find({ date });

    // Calculate averages
    const analytics = {
      breakfast: { avg: 0, count: 0 },
      lunch: { avg: 0, count: 0 },
      dinner: { avg: 0, count: 0 }
    };

    ratings.forEach(r => {
      analytics[r.mealType].avg += r.rating;
      analytics[r.mealType].count += 1;
    });

    Object.keys(analytics).forEach(type => {
      if (analytics[type].count > 0) {
        analytics[type].avg = (analytics[type].avg / analytics[type].count).toFixed(1);
      }
    });

    res.json({ success: true, analytics, raw: ratings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  seedMenu,
  getWeeklyMenu,
  updateMenu,
  submitRating,
  getTodayRatings
};
