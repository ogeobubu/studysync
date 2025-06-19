const {
  createNotification,
  markAsRead,
  getUserNotifications,
  markAllAsRead
} = require('../services/notificationService');

// @desc    Get user notifications
// @route   GET /api/notifications/:userId
// @access  Private
exports.getUserNotifications = async (req, res, next) => {
  try {
    const notifications = await getUserNotifications(
      req.params.userId,
      req.query.limit,
      req.query.includeRead === 'true'
    );
    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res, next) => {
  try {
    const notification = await markAsRead(req.params.id);
    res.status(200).json({
      success: true,
      data: notification
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all notifications as read
// @route   PATCH /api/notifications/user/:userId/read-all
// @access  Private
exports.markAllAsRead = async (req, res, next) => {
  try {
    const count = await markAllAsRead(req.params.userId);
    res.status(200).json({
      success: true,
      message: `Marked ${count} notifications as read`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create notification (for internal use)
// @route   POST /api/notifications
// @access  Private/Admin
exports.createNotification = async (req, res, next) => {
  try {
    const { userId, message, type } = req.body;
    const notification = await createNotification(userId, message, type);
    res.status(201).json({
      success: true,
      data: notification
    });
  } catch (error) {
    next(error);
  }
};