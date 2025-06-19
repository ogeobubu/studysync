const Notification = require('../models/Notification');

const createNotification = async (userId, message, type = 'system') => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID');
  }

  if (!message || typeof message !== 'string') {
    throw new Error('Message must be a valid string');
  }

  const validTypes = ['system', 'academic', 'alert'];
  if (!validTypes.includes(type)) {
    throw new Error(`Invalid notification type. Must be one of: ${validTypes.join(', ')}`);
  }

  try {
    const notification = new Notification({
      user: userId,
      message,
      type,
      read: false
    });
    
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Notification creation failed:', error.message);
    throw new Error('Failed to create notification');
  }
};

const markAsRead = async (notificationId) => {
  if (!mongoose.Types.ObjectId.isValid(notificationId)) {
    throw new Error('Invalid notification ID');
  }

  try {
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { $set: { read: true } },
      { new: true }
    );

    if (!notification) {
      throw new Error('Notification not found');
    }

    return notification;
  } catch (error) {
    console.error('Failed to mark notification as read:', error.message);
    throw new Error('Failed to update notification status');
  }
};

const getUserNotifications = async (userId, limit = 10, includeRead = false) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID');
  }

  try {
    const query = { user: userId };
    if (!includeRead) {
      query.read = false;
    }

    return await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .lean();
  } catch (error) {
    console.error('Failed to fetch notifications:', error.message);
    throw new Error('Failed to retrieve notifications');
  }
};

const markAllAsRead = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID');
  }

  try {
    const result = await Notification.updateMany(
      { user: userId, read: false },
      { $set: { read: true } }
    );
    return result.modifiedCount;
  } catch (error) {
    console.error('Failed to mark all notifications as read:', error.message);
    throw new Error('Failed to update notifications');
  }
};

module.exports = {
  createNotification,
  markAsRead,
  getUserNotifications,
  markAllAsRead
};