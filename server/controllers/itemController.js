const Item = require("../models/Item");

// Create a lost/found item
const createItem = async (req, res) => {
  try {
    const {
      type,
      title,
      description,
      category,
      location,
      date,
      image,
      contactPreference,
    } = req.body;

    if (
      !type ||
      !title ||
      !description ||
      !category ||
      !location ||
      !date
    ) {
      return res.status(400).json({
        message: "Please fill in all required fields",
      });
    }

    if (!["LOST", "FOUND"].includes(type)) {
      return res.status(400).json({
        message: "Invalid item type",
      });
    }

    const item = await Item.create({
      type,
      title,
      description,
      category,
      location,
      date,
      image: image || "",
      contactPreference: contactPreference || "CHAT",
      reportedBy: req.user._id,
    });

    res.status(201).json({
      message: `${
        type === "LOST" ? "Lost" : "Found"
      } item reported successfully`,
      item,
    });
  } catch (error) {
    console.error("Create item error:", error.message);

    res.status(500).json({
      message: "Server error while creating item",
    });
  }
};

// Normalize text for comparison
const normalizeText = (text = "") => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
};

// Calculate common words between two pieces of text
const calculateTextSimilarity = (text1, text2) => {
  const words1 = new Set(normalizeText(text1));
  const words2 = new Set(normalizeText(text2));

  if (words1.size === 0 || words2.size === 0) {
    return 0;
  }

  let commonWords = 0;

  for (const word of words1) {
    if (words2.has(word)) {
      commonWords++;
    }
  }

  const smallerSetSize = Math.min(words1.size, words2.size);

  return commonWords / smallerSetSize;
};

// Calculate date similarity
const calculateDateScore = (date1, date2) => {
  const firstDate = new Date(date1);
  const secondDate = new Date(date2);

  const differenceInMilliseconds = Math.abs(
    firstDate.getTime() - secondDate.getTime()
  );

  const differenceInDays =
    differenceInMilliseconds / (1000 * 60 * 60 * 24);

  if (differenceInDays === 0) {
    return 20;
  }

  if (differenceInDays <= 1) {
    return 18;
  }

  if (differenceInDays <= 3) {
    return 14;
  }

  if (differenceInDays <= 7) {
    return 8;
  }

  if (differenceInDays <= 14) {
    return 4;
  }

  return 0;
};

// Get potential matches for an item
const getPotentialMatches = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    const oppositeType = item.type === "LOST" ? "FOUND" : "LOST";

    const possibleMatches = await Item.find({
      type: oppositeType,
      status: "ACTIVE",
      reportedBy: { $ne: item.reportedBy },
      _id: { $ne: item._id },
    })
      .populate("reportedBy", "name usn branch")
      .sort({ createdAt: -1 })
      .limit(50);

    const matches = possibleMatches
      .map((candidate) => {
        let score = 0;

        // Category = 30 points
        if (
          candidate.category.toLowerCase() ===
          item.category.toLowerCase()
        ) {
          score += 30;
        }

        // Location = 25 points
        if (
          candidate.location.toLowerCase() ===
          item.location.toLowerCase()
        ) {
          score += 25;
        }

        // Date = up to 20 points
        score += calculateDateScore(item.date, candidate.date);

        // Title = up to 10 points
        const titleSimilarity = calculateTextSimilarity(
          item.title,
          candidate.title
        );

        score += Math.round(titleSimilarity * 10);

        // Description = up to 15 points
        const descriptionSimilarity = calculateTextSimilarity(
          item.description,
          candidate.description
        );

        score += Math.round(descriptionSimilarity * 15);

        return {
          item: candidate,
          matchScore: Math.min(score, 100),
        };
      })
      .filter((match) => match.matchScore >= 25)
      .sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json({
      item,
      matches,
    });
  } catch (error) {
    console.error("Get matches error:", error.message);

    res.status(500).json({
      message: "Server error while finding matches",
    });
  }
};

// Get all items reported by the currently logged-in user
const getMyItems = async (req, res) => {
  try {
    const items = await Item.find({
      reportedBy: req.user._id,
    })
      .populate("reportedBy", "name usn branch")
      .sort({ createdAt: -1 });

    res.status(200).json({
      items,
    });
  } catch (error) {
    console.error("Get my items error:", error.message);

    res.status(500).json({
      message: "Server error while getting your items.",
    });
  }
};

// Update an item reported by the logged-in user
const updateItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const {
      title,
      description,
      category,
      location,
      date,
      image,
      contactPreference,
    } = req.body;

    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({
        message: "Item not found.",
      });
    }

    // Only the original reporter can edit the item
    if (item.reportedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to edit this item.",
      });
    }

    // Returned/closed items cannot be modified
    if (["RETURNED", "CLOSED"].includes(item.status)) {
      return res.status(400).json({
        message: "Returned or closed items cannot be edited.",
      });
    }

    // Validate required fields
    if (
      !title ||
      !description ||
      !category ||
      !location ||
      !date
    ) {
      return res.status(400).json({
        message: "Please fill in all required fields.",
      });
    }

    // Update editable fields
    item.title = title.trim();
    item.description = description.trim();
    item.category = category.trim();
    item.location = location.trim();
    item.date = date;

    if (image !== undefined) {
      item.image = image;
    }

    if (contactPreference !== undefined) {
      item.contactPreference = contactPreference;
    }

    await item.save();

    res.status(200).json({
      message: "Item updated successfully.",
      item,
    });
  } catch (error) {
    console.error("Update item error:", error.message);

    res.status(500).json({
      message: "Server error while updating item.",
    });
  }
};

// Delete an item reported by the logged-in user
const deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({
        message: "Item not found.",
      });
    }

    // Only the original reporter can delete the item
    if (item.reportedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to delete this item.",
      });
    }

    // Returned/closed items cannot be deleted
    if (["RETURNED", "CLOSED"].includes(item.status)) {
      return res.status(400).json({
        message: "Returned or closed items cannot be deleted.",
      });
    }

    await Item.findByIdAndDelete(itemId);

    res.status(200).json({
      message: "Item deleted successfully.",
    });
  } catch (error) {
    console.error("Delete item error:", error.message);

    res.status(500).json({
      message: "Server error while deleting item.",
    });
  }
};

module.exports = {
  createItem,
  getPotentialMatches,
  getMyItems,
  updateItem,
  deleteItem,
};