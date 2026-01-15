  const express = require("express");
  const Message = require("../models/ChatModel");
  const { protect } = require("../middleware/authMiddleware");

  const ChatRouter = express.Router();

  /* SEND MESSAGE */
  ChatRouter.post("/", protect, async (req, res) => {
    try {
      const { content, groupId } = req.body;

      const message = await Message.create({
        sender: req.user._id,
        content,
        group: groupId,
      });

      const populatedMessage = await Message.findById(message._id)
        .populate("sender", "username email")
        .populate("group", "name");

      res.status(201).json(populatedMessage);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  /* GET GROUP MESSAGES */
  ChatRouter.get("/:groupId", protect, async (req, res) => {
    try {
      const { groupId } = req.params;

      const messages = await Message.find({ group: groupId })
        .populate("sender", "username email")
        .sort({ createdAt: 1 });

      res.json(messages);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  module.exports = ChatRouter;
