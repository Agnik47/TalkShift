const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const Message = require("../models/ChatModel");
const { generateChatSummary } = require("../services/aiService.js");

const router = express.Router();

//! POST: /api/ai/summary/:groupId
router.post("/summary/:groupId", protect, async (req, res) => {
  try {
    const { groupId } = req.params;

    const messages = await Message.find({ group: groupId })
      .populate("sender", "username email")
      .sort({ createdAt: -1 })
      .limit(10);

    if (!messages || messages.length === 0) {
      return res.json({
        summary: "No messages available to summarize.",
      });
    }

    const summary = await generateChatSummary(messages.reverse());

    res.status(200).json({ summary });
  } catch (error) {
    console.log("AI Route Error:", error.message);
    res.status(500).json({
      message: "Failed to generate summary",
    });
  }
});

module.exports = router;
