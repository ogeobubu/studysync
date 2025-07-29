const express = require('express');
const router = express.Router();
const {
  getUserNotifications,
  markAsRead,
  markAllAsRead
} = require('../controllers/notificationController');
const { protect } = require('../middlewares/authMiddleware');

// Protect all notification routes
router.use(protect);

// Get user notifications
router.get("/:id", getUserNotifications);

// Mark notification as read
router.patch('/:id/read', markAsRead);

// Mark all notifications as read
router.patch('/user/:id/read-all', markAllAsRead);

module.exports = router;