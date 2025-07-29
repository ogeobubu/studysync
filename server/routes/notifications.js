const express = require('express');
const router = express.Router();
const {
  getUserNotifications,
  markAsRead,
  markAllAsRead
} = require('../controllers/notificationController');
const { protect } = require('../middlewares/authMiddleware');

// Get user notifications
router.get("/:id", protect, getUserNotifications);

// Mark notification as read
router.patch("/:id/read", protect, markAsRead);

// Mark all notifications as read
router.patch("/user/:id/read-all", protect, markAllAsRead);

module.exports = router;