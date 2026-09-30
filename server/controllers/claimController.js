const Claim = require("../models/Claim");
const Item = require("../models/Item");

// Create a claim request
const createClaim = async (req, res) => {
  try {
    const { verificationMessage } = req.body;
    const { itemId } = req.params;

    if (!verificationMessage || !verificationMessage.trim()) {
      return res.status(400).json({
        message: "Please provide verification details.",
      });
    }

    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({
        message: "Item not found.",
      });
    }

    if (item.type !== "FOUND") {
      return res.status(400).json({
        message: "Only found items can be claimed.",
      });
    }

    if (item.status !== "ACTIVE") {
      return res.status(400).json({
        message: "This item is no longer available for claiming.",
      });
    }

    if (item.reportedBy.toString() === req.user._id.toString()) {
      return res.status(400).json({
        message: "You cannot claim an item that you reported.",
      });
    }

    const existingClaim = await Claim.findOne({
      item: item._id,
      claimant: req.user._id,
      status: "PENDING",
    });

    if (existingClaim) {
      return res.status(409).json({
        message: "You already have a pending claim for this item.",
      });
    }

    const claim = await Claim.create({
      item: item._id,
      claimant: req.user._id,
      finder: item.reportedBy,
      verificationMessage: verificationMessage.trim(),
    });

    await claim.populate([
      {
        path: "claimant",
        select: "name email usn branch",
      },
      {
        path: "finder",
        select: "name email usn branch",
      },
      {
        path: "item",
        select: "title description category location date status",
      },
    ]);

    res.status(201).json({
      message: "Claim request submitted successfully.",
      claim,
    });
  } catch (error) {
    console.error("Create claim error:", error.message);

    res.status(500).json({
      message: "Server error while creating claim.",
    });
  }
};

// Get claims received by the logged-in finder
const getFinderClaims = async (req, res) => {
  try {
    const claims = await Claim.find({
      finder: req.user._id,
    })
      .populate("claimant", "name email usn branch")
      .populate("item", "title description category location date status")
      .sort({ createdAt: -1 });

    res.status(200).json({
      claims,
    });
  } catch (error) {
    console.error("Get finder claims error:", error.message);

    res.status(500).json({
      message: "Server error while getting claim requests.",
    });
  }
};

// Accept a claim
const acceptClaim = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.claimId);

    if (!claim) {
      return res.status(404).json({
        message: "Claim not found.",
      });
    }

    if (claim.finder.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to accept this claim.",
      });
    }

    if (claim.status !== "PENDING") {
      return res.status(400).json({
        message: "This claim is no longer pending.",
      });
    }

    const item = await Item.findById(claim.item);

    if (!item) {
      return res.status(404).json({
        message: "Item not found.",
      });
    }

    if (item.status !== "ACTIVE") {
      return res.status(400).json({
        message: "This item is no longer available.",
      });
    }

    // Accept the selected claim
    claim.status = "ACCEPTED";
    await claim.save();

    // Mark the found item as claimed
    item.status = "CLAIMED";
    await item.save();

    // Reject all other pending claims for the same item
    await Claim.updateMany(
      {
        item: claim.item,
        _id: { $ne: claim._id },
        status: "PENDING",
      },
      {
        $set: {
          status: "REJECTED",
        },
      }
    );

    res.status(200).json({
      message: "Claim accepted successfully.",
      claim,
    });
  } catch (error) {
    console.error("Accept claim error:", error.message);

    res.status(500).json({
      message: "Server error while accepting claim.",
    });
  }
};

// Reject a claim
const rejectClaim = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.claimId);

    if (!claim) {
      return res.status(404).json({
        message: "Claim not found.",
      });
    }

    if (claim.finder.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to reject this claim.",
      });
    }

    if (claim.status !== "PENDING") {
      return res.status(400).json({
        message: "This claim is no longer pending.",
      });
    }

    claim.status = "REJECTED";
    await claim.save();

    res.status(200).json({
      message: "Claim rejected successfully.",
      claim,
    });
  } catch (error) {
    console.error("Reject claim error:", error.message);

    res.status(500).json({
      message: "Server error while rejecting claim.",
    });
  }
};

module.exports = {
  createClaim,
  getFinderClaims,
  acceptClaim,
  rejectClaim,
};