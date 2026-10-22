
const express = require("express");
const router = express.Router();

const {
  getPendingReports,
  reviewReport,
} = require("../controllers/adminReportController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// Get all pending reports
router.get("/pending", protect, adminOnly, getPendingReports);

// Review or dismiss a report
router.patch("/:reportId/review", protect, adminOnly, reviewReport);

module.exports = router;
