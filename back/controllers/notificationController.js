const Notification = require("../models/Notification");

// Create a new notification
exports.createNotification = async (userId, type, message) => {
  try {
    const notification = new Notification({
      user: userId,
      type,
      message,
    });
    await notification.save();
  } catch (err) {
    console.error("Error creating notification:", err);
  }
};

// Get notifications for a user
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id });
    res.status(200).json(notifications);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching notifications", error: err });
  }
};

// Mark a notification as read
exports.markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { status: "read" });
    res.status(200).json({ message: "Notification marked as read" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating notification", error: err });
  }
};
