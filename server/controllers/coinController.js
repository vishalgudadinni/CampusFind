const User = require("../models/User");
const CoinTransaction = require("../models/CoinTransaction");

// Get current user's Campus Coins wallet
const getWallet = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "name coinBalance"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    const transactions = await CoinTransaction.find({
      user: req.user._id,
    })
      .populate("item", "title category")
      .populate("claim", "status")
      .sort({ createdAt: -1 });

    res.status(200).json({
      wallet: {
        name: user.name,
        coinBalance: user.coinBalance,
        transactions,
      },
    });
  } catch (error) {
    console.error("Get wallet error:", error.message);

    res.status(500).json({
      message: "Server error while getting Campus Coins.",
    });
  }
};

module.exports = {
  getWallet,
};