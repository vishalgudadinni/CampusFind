const mongoose = require("mongoose");

const claimSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },

    claimant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    finder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    verificationMessage: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "REJECTED", "CANCELLED"],
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Claim", claimSchema);