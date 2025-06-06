const Notification = require('../models/Notification');

const createNotification = async (userId, message, type) => {
  const notification = new Notification({
    userId,
    message,
    type,
    read: false
  });
  
  await notification.save();
  return notification;
};

const markAsRead = async (notificationId) => {
  return Notification.findByIdAndUpdate(
    notificationId,
    { read: true },
    { new: true }
  );
};

const getUserNotifications = async (userId) => {
  return Notification.find({ userId, read: false })
    .sort({ createdAt: -1 })
    .limit(10);
};

module.exports = {
  createNotification,
  markAsRead,
  getUserNotifications
};