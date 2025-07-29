const express = require('express');
const router = express.Router();
const {
  getUserNotifications,
  markAsRead,
  markAllAsRead
} = require('../controllers/notificationController');

// Get user notifications
router.get("/:id", getUserNotifications);

// Mark notification as read
router.patch("/read/:id", markAsRead);

// Mark all notifications as read
router.patch("/user/read-all/:id", markAllAsRead);

module.exports = router;