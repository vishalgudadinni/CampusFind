
const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },

    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    reason: {
      type: String,
      enum: [
        "FAKE_LISTING",
        "MISINFORMATION",
        "SCAM",
        "DUPLICATE",
        "INAPPROPRIATE",
        "OTHER",
      ],
      required: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    status: {
      type: String,
      enum: ["PENDING", "REVIEWED", "DISMISSED", "ACTION_TAKEN"],
      default: "PENDING",
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    adminNote: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
  },
  { timestamps: true }
);

// Prevent the same student from submitting multiple reports
// for the same item while an earlier report is pending.
reportSchema.index(
  { item: 1, reportedBy: 1 },
  {
    unique: true,
    partialFilterExpression: { status: "PENDING" },
  }
);

module.exports = mongoose.model("Report", reportSchema);
