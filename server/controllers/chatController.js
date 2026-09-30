const Conversation = require("../models/Conversation");
const Claim = require("../models/Claim");
const Message = require("../models/Message");

// Create or get a conversation for an accepted claim
const getOrCreateConversation = async (req, res) => {
  try {
    const { claimId } = req.params;

    const claim = await Claim.findById(claimId);

    if (!claim) {
      return res.status(404).json({
        message: "Claim not found.",
      });
    }

    if (claim.status !== "ACCEPTED") {
      return res.status(400).json({
        message: "Chat is available only after a claim is accepted.",
      });
    }

    const isParticipant =
      claim.claimant.toString() === req.user._id.toString() ||
      claim.finder.toString() === req.user._id.toString();

    if (!isParticipant) {
      return res.status(403).json({
        message: "You are not authorized to access this conversation.",
      });
    }

    let conversation = await Conversation.findOne({
      claim: claim._id,
    })
      .populate("item", "title description category location date status")
      .populate("participants", "name email usn branch");

    if (!conversation) {
      conversation = await Conversation.create({
        item: claim.item,
        claim: claim._id,
        participants: [claim.claimant, claim.finder],
      });

      conversation = await Conversation.findById(conversation._id)
        .populate("item", "title description category location date status")
        .populate("participants", "name email usn branch");
    }

    res.status(200).json({
      message: "Conversation ready.",
      conversation,
    });
  } catch (error) {
    console.error("Get conversation error:", error.message);

    res.status(500).json({
      message: "Server error while opening conversation.",
    });
  }
};

// Get messages from a conversation
const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found.",
      });
    }

    const isParticipant = conversation.participants.some(
      (participant) =>
        participant.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({
        message: "You are not authorized to view these messages.",
      });
    }

    const messages = await Message.find({
      conversation: conversation._id,
    })
      .populate("sender", "name usn branch")
      .sort({ createdAt: 1 });

    res.status(200).json({
      messages,
    });
  } catch (error) {
    console.error("Get messages error:", error.message);

    res.status(500).json({
      message: "Server error while getting messages.",
    });
  }
};

// Send a message
const sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        message: "Message cannot be empty.",
      });
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found.",
      });
    }

    if (conversation.status !== "ACTIVE") {
      return res.status(400).json({
        message: "This conversation is closed.",
      });
    }

    const isParticipant = conversation.participants.some(
      (participant) =>
        participant.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({
        message: "You are not authorized to send messages here.",
      });
    }

    const message = await Message.create({
      conversation: conversation._id,
      sender: req.user._id,
      text: text.trim(),
    });

    await message.populate("sender", "name usn branch");

    res.status(201).json({
      message: "Message sent successfully.",
      data: message,
    });
  } catch (error) {
    console.error("Send message error:", error.message);

    res.status(500).json({
      message: "Server error while sending message.",
    });
  }
};

module.exports = {
  getOrCreateConversation,
  getMessages,
  sendMessage,
};