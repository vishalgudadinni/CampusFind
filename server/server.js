const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const itemRoutes = require("./routes/itemRoutes");
const claimRoutes = require("./routes/claimRoutes");
const chatRoutes = require("./routes/chatRoutes");
const returnRoutes = require("./routes/returnRoutes");
const coinRoutes = require("./routes/coinRoutes");
const reportRoutes = require("./routes/reportRoutes");
const adminReportRoutes = require("./routes/adminReportRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/claims", claimRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/returns", returnRoutes);
app.use("/api/coins", coinRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/admin/reports", adminReportRoutes);

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "CampusFind API is running",
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`CampusFind server running on port ${PORT}`);
  });
};

startServer();