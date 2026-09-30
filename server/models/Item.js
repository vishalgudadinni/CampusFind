const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["LOST", "FOUND"],
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: Date,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["ACTIVE", "CLAIMED", "RETURNED", "CLOSED"],
      default: "ACTIVE",
    },

    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    contactPreference: {
      type: String,
      enum: ["CHAT", "EMAIL"],
      default: "CHAT",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Item", itemSchema);