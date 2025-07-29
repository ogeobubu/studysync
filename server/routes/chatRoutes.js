const express = require("express");
const router = express.Router();
const {
  getChats,
  getChatMessages,
  sendMessage,
  startChat,
  closeChat
} = require("../controllers/chatController");

// Get all chats for current user
router.get("/", getChats);

// Get messages for specific chat
router.get("/:id", getChatMessages);

// Send message in chat
router.post("/messages/:id", sendMessage);

// Start new chat (student initiates with advisor)
router.post("/start", startChat);

// Close chat
router.patch("/close", closeChat);

module.exports = router;