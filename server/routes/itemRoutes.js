const express = require("express");

const {
  createItem,
  getPotentialMatches,
  getMyItems,
  updateItem,
  deleteItem,
} = require("../controllers/itemController");

const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

// Create a lost/found item
router.post("/", protect, createItem);

// Get items reported by the logged-in user
router.get("/my-items", protect, getMyItems);

// Update an item reported by the logged-in user
router.patch("/:itemId", protect, updateItem);

// Delete an item reported by the logged-in user
router.delete("/:itemId", protect, deleteItem);

// Get potential matches for an item
router.get("/:id/matches", protect, getPotentialMatches);

module.exports = router;