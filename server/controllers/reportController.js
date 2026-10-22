
const Report = require("../models/Report");
const Item = require("../models/Item");

const createReport = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { reason, description } = req.body;

    // Validate required fields
    if (!reason || !description || !description.trim()) {
      return res.status(400).json({
        message: "Please select a reason and provide a description.",
      });
    }

    // Validate report reason
    const allowedReasons = [
      "FAKE_LISTING",
      "MISINFORMATION",
      "SCAM",
      "DUPLICATE",
      "INAPPROPRIATE",
      "OTHER",
    ];

    if (!allowedReasons.includes(reason)) {
      return res.status(400).json({
        message: "Invalid report reason.",
      });
    }

    if (description.trim().length > 1000) {
      return res.status(400).json({
        message: "Description cannot exceed 1000 characters.",
      });
    }

    // Check whether the item exists
    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({
        message: "Item not found.",
      });
    }

    // Prevent users from reporting their own listings
    if (item.reportedBy.toString() === req.user._id.toString()) {
      return res.status(403).json({
        message: "You cannot report your own listing.",
      });
    }

    // Prevent duplicate pending reports by the same user
    const existingReport = await Report.findOne({
      item: item._id,
      reportedBy: req.user._id,
      status: "PENDING",
    });

    if (existingReport) {
      return res.status(409).json({
        message: "You already have a pending report for this item.",
      });
    }

    const report = await Report.create({
      item: item._id,
      reportedBy: req.user._id,
      reason,
      description: description.trim(),
    });

    await report.populate([
      { path: "item", select: "title type category location status" },
      { path: "reportedBy", select: "name usn branch" },
    ]);

    return res.status(201).json({
      message: "Report submitted successfully. Our team will review it.",
      report,
    });
  } catch (error) {
    // Handle duplicate-index errors safely
    if (error.code === 11000) {
      return res.status(409).json({
        message: "You already have a pending report for this item.",
      });
    }

    console.error("Create report error:", error.message);

    return res.status(500).json({
      message: "Server error while submitting report.",
    });
  }
};

const getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({
      reportedBy: req.user._id,
    })
      .populate("item", "title type category location status")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: reports.length,
      reports,
    });
  } catch (error) {
    console.error("Get my reports error:", error.message);

    return res.status(500).json({
      message: "Server error while fetching your reports.",
    });
  }
};

module.exports = {
  createReport,
  getMyReports,
};