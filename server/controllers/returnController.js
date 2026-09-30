const ReturnConfirmation = require("../models/ReturnConfirmation");
const Claim = require("../models/Claim");
const Item = require("../models/Item");
const User = require("../models/User");
const CoinTransaction = require("../models/CoinTransaction");

const COINS_FOR_SUCCESSFUL_RETURN = 20;

// Create or get return confirmation
const getOrCreateReturnConfirmation = async (req, res) => {
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
        message: "Return confirmation is available only for accepted claims.",
      });
    }

    const isParticipant =
      claim.finder.toString() === req.user._id.toString() ||
      claim.claimant.toString() === req.user._id.toString();

    if (!isParticipant) {
      return res.status(403).json({
        message: "You are not authorized to access this return confirmation.",
      });
    }

    let confirmation = await ReturnConfirmation.findOne({
      claim: claim._id,
    });

    if (!confirmation) {
      confirmation = await ReturnConfirmation.create({
        item: claim.item,
        claim: claim._id,
        finder: claim.finder,
        claimant: claim.claimant,
      });
    }

    await confirmation.populate([
      {
        path: "item",
        select: "title description category location date status",
      },
      {
        path: "finder",
        select: "name email usn branch coinBalance",
      },
      {
        path: "claimant",
        select: "name email usn branch",
      },
    ]);

    res.status(200).json({
      message: "Return confirmation ready.",
      confirmation,
    });
  } catch (error) {
    console.error(
      "Get return confirmation error:",
      error.message
    );

    res.status(500).json({
      message: "Server error while getting return confirmation.",
    });
  }
};

// Confirm return
const confirmReturn = async (req, res) => {
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
        message: "Only accepted claims can be confirmed.",
      });
    }

    const confirmation = await ReturnConfirmation.findOne({
      claim: claim._id,
    });

    if (!confirmation) {
      return res.status(404).json({
        message: "Return confirmation not found.",
      });
    }

    if (confirmation.status === "COMPLETED") {
      return res.status(400).json({
        message: "This item has already been marked as returned.",
      });
    }

    const userId = req.user._id.toString();

    const isFinder =
      confirmation.finder.toString() === userId;

    const isClaimant =
      confirmation.claimant.toString() === userId;

    if (!isFinder && !isClaimant) {
      return res.status(403).json({
        message: "You are not authorized to confirm this return.",
      });
    }

    // Record the confirmation
    if (isFinder) {
      if (confirmation.confirmedByFinder) {
        return res.status(400).json({
          message: "You have already confirmed the return.",
        });
      }

      confirmation.confirmedByFinder = true;
    }

    if (isClaimant) {
      if (confirmation.confirmedByClaimant) {
        return res.status(400).json({
          message: "You have already confirmed the return.",
        });
      }

      confirmation.confirmedByClaimant = true;
    }

    // Check whether both parties have confirmed
    const bothConfirmed =
      confirmation.confirmedByFinder &&
      confirmation.confirmedByClaimant;

    if (!bothConfirmed) {
      await confirmation.save();

      return res.status(200).json({
        message:
          "Your return confirmation has been recorded. Waiting for the other participant.",
        confirmation,
      });
    }

    // Both parties have confirmed.
    // Award coins only once.
    const existingReward = await CoinTransaction.findOne({
      claim: claim._id,
      type: "REWARD",
    });

    if (existingReward) {
      confirmation.status = "COMPLETED";
      confirmation.coinsAwarded = existingReward.amount;
      confirmation.completedAt =
        confirmation.completedAt || new Date();

      await confirmation.save();

      return res.status(200).json({
        message: "Return already completed and reward recorded.",
        confirmation,
      });
    }

    const item = await Item.findById(claim.item);

    if (!item) {
      return res.status(404).json({
        message: "Item not found.",
      });
    }

    if (item.status !== "CLAIMED") {
      return res.status(400).json({
        message: "This item is not currently in the claimed state.",
      });
    }

    const finder = await User.findById(confirmation.finder);

    if (!finder) {
      return res.status(404).json({
        message: "Finder not found.",
      });
    }

    // Award Campus Coins to the finder
    finder.coinBalance += COINS_FOR_SUCCESSFUL_RETURN;
    await finder.save();

    // Record the reward transaction
    await CoinTransaction.create({
      user: finder._id,
      type: "REWARD",
      amount: COINS_FOR_SUCCESSFUL_RETURN,
      reason: "Successful return of a lost item",
      item: item._id,
      claim: claim._id,
    });

    // Update return confirmation
    confirmation.status = "COMPLETED";
    confirmation.coinsAwarded =
      COINS_FOR_SUCCESSFUL_RETURN;
    confirmation.completedAt = new Date();

    await confirmation.save();

    // Update item status
    item.status = "RETURNED";
    await item.save();

    res.status(200).json({
      message:
        "Item return confirmed successfully. Campus Coins have been awarded to the finder.",
      coinsAwarded: COINS_FOR_SUCCESSFUL_RETURN,
      confirmation,
    });
  } catch (error) {
    console.error(
      "Confirm return error:",
      error.message
    );

    res.status(500).json({
      message: "Server error while confirming return.",
    });
  }
};

module.exports = {
  getOrCreateReturnConfirmation,
  confirmReturn,
};