
const Report = require("../models/Report");

const getPendingReports = async (req, res) => {
  try {
    const reports = await Report.find({ status: "PENDING" })
      .populate("item", "title type category location status reportedBy")
      .populate("reportedBy", "name usn branch email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: reports.length,
      reports,
    });
  } catch (error) {
    console.error("Get pending reports error:", error.message);

    return res.status(500).json({
      message: "Server error while fetching pending reports.",
    });
  }
};


const reviewReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { status, adminNote = "" } = req.body;

    const allowedStatuses = [
      "REVIEWED",
      "DISMISSED",
      "ACTION_TAKEN",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid report review status.",
      });
    }

    if (typeof adminNote !== "string" || adminNote.length > 1000) {
      return res.status(400).json({
        message: "Admin note must be a string of at most 1000 characters.",
      });
    }

    const Report = require("../models/Report");

    const report = await Report.findById(reportId);

    if (!report) {
      return res.status(404).json({
        message: "Report not found.",
      });
    }

    if (report.status !== "PENDING") {
      return res.status(409).json({
        message: "This report has already been reviewed.",
      });
    }

    report.status = status;
    report.adminNote = adminNote.trim();
    report.reviewedBy = req.user._id;

    await report.save();

    return res.status(200).json({
      message: "Report reviewed successfully.",
      report,
    });
  } catch (error) {
    console.error("Review report error:", error.message);

    return res.status(500).json({
      message: "Server error while reviewing report.",
    });
  }
};

module.exports = {
  getPendingReports,
  reviewReport,
};
