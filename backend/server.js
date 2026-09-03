const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

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
const notificationRoutes = require("./routes/notificationRoutes");
const gateRoutes = require("./routes/gateRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const communityRoutes = require("./routes/communityRoutes");

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
app.use("/api/notifications", notificationRoutes);
app.use("/api/gate", gateRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/community", communityRoutes);

app.get("/", (req, res) => {
  res.send("Hostel Management API Running...");
});

const PORT = process.env.PORT || 5000;

const runLaundryAutomation = require("./utils/laundryAutoJob");

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  // Run laundry automation every minute
  setInterval(runLaundryAutomation, 60000);
});
