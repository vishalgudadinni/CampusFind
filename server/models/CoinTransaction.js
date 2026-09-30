const mongoose = require("mongoose");

const coinTransactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["REWARD", "REDEMPTION"],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    reason: {
      type: String,
      required: true,
      trim: true,
    },

    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      default: null,
    },

    claim: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Claim",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "CoinTransaction",
  coinTransactionSchema
);