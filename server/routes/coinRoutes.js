const express = require("express");

const { getWallet } = require("../controllers/coinController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Get current user's Campus Coins wallet
router.get("/wallet", protect, getWallet);

module.exports = router;