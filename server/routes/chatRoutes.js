const express = require("express");

const {
  getOrCreateConversation,
  getMessages,
  sendMessage,
} = require("../controllers/chatController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Open or create chat for an accepted claim
router.get("/claims/:claimId", protect, getOrCreateConversation);

// Get messages
router.get(
  "/conversations/:conversationId/messages",
  protect,
  getMessages
);

// Send a message
router.post(
  "/conversations/:conversationId/messages",
  protect,
  sendMessage
);

module.exports = router;