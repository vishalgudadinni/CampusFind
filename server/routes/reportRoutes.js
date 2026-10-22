
const express = require("express");
const router = express.Router();

const {
  createReport,
  getMyReports,
} = require("../controllers/reportController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// Submit a report for an item
router.post("/items/:itemId", protect, createReport);

// Get reports submitted by the logged-in user
router.get("/my-reports", protect, getMyReports);

module.exports = router;
