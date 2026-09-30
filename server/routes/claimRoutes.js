const express = require("express");

const {
  createClaim,
  getFinderClaims,
  acceptClaim,
  rejectClaim,
} = require("../controllers/claimController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/items/:itemId", protect, createClaim);

router.get("/received", protect, getFinderClaims);

router.patch("/:claimId/accept", protect, acceptClaim);

router.patch("/:claimId/reject", protect, rejectClaim);

module.exports = router;