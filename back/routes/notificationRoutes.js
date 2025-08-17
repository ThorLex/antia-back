const express = require("express");
const router = express.Router();
const {
  getNotifications,
  markAsRead,
} = require("../controllers/notificationController");

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Retrieve all notifications for the user
 *     tags: [Notifications]
 *     responses:
 *       200:
 *         description: List of notifications
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /notifications/{id}/read:
 *   patch:
 *     summary: Mark a notification as read
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Notification marked as read
 *       404:
 *         description: Notification not found
 */

// Get all notifications
router.get("/", getNotifications);

// Mark notification as read
router.patch("/:id/read", markAsRead);

module.exports = router;
