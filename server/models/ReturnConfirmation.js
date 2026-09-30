const mongoose = require("mongoose");

const returnConfirmationSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
      unique: true,
    },

    claim: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Claim",
      required: true,
      unique: true,
    },

    finder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    claimant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    confirmedByClaimant: {
      type: Boolean,
      default: false,
    },

    confirmedByFinder: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["PENDING", "COMPLETED"],
      default: "PENDING",
    },

    coinsAwarded: {
      type: Number,
      default: 0,
      min: 0,
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "ReturnConfirmation",
  returnConfirmationSchema
);