const express = require("express");

const {
  getOrCreateReturnConfirmation,
  confirmReturn,
} = require("../controllers/returnController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Get or create return confirmation for an accepted claim
router.get(
  "/claims/:claimId",
  protect,
  getOrCreateReturnConfirmation
);

// Confirm the item return
router.patch(
  "/claims/:claimId/confirm",
  protect,
  confirmReturn
);

module.exports = router;