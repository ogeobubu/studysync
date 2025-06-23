const express = require('express');
const router = express.Router();
const {
  getChats,
  getChatMessages,
  sendMessage,
  startChat,
  closeChat
} = require('../controllers/chatController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Get all chats for current user
router.get('/', protect, getChats);

// Get messages for specific chat
router.get('/:chatId', protect, getChatMessages);

// Send message in chat
router.post('/:chatId/messages', protect, sendMessage);

// Start new chat (student initiates with advisor)
router.post('/start', protect, authorize('student'), startChat);

// Close chat
router.patch('/:chatId/close', protect, closeChat);

module.exports = router;