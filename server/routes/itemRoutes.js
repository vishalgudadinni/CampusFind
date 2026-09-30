const express = require("express");

const {
  createItem,
  getPotentialMatches,
  getMyItems,
} = require("../controllers/itemController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Create a lost/found item
router.post("/", protect, createItem);

// Get items reported by the logged-in user
router.get("/my-items", protect, getMyItems);

// Get potential matches for an item
router.get("/:id/matches", protect, getPotentialMatches);

module.exports = router;