const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const visitorRoutes = require("./routes/visitorRoutes");
const laundryRoutes = require("./routes/laundryRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const noticeRoutes = require("./routes/noticeRoutes");
const leaveRoutes = require("./routes/leaveRoutes");
const roomTransferRoutes = require("./routes/roomTransferRoutes");
const messRoutes = require("./routes/messRoutes");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/visitors", visitorRoutes);
app.use("/api/laundry", laundryRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/room-transfer", roomTransferRoutes);
app.use("/api/mess", messRoutes);

app.get("/", (req, res) => {
  res.send("Hostel Management API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});