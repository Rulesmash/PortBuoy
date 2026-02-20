const express = require('express');
const { getNotifications, createNotification, markAsRead } = require('../controllers/notificationController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Get current user notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications list
 */
router.route('/')
    .get(getNotifications)
    /**
     * @swagger
     * /api/notifications:
     *   post:
     *     summary: Create a notification manually (Admin only)
     *     tags: [Notifications]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               user:
     *                 type: string
     *               type:
     *                 type: string
     *                 enum: [alert, reminder, congestion_warning]
     *               message:
     *                 type: string
     *     responses:
     *       201:
     *         description: Notification created
     */
    .post(authorize('admin'), createNotification);

/**
 * @swagger
 * /api/notifications/{id}/read:
 *   put:
 *     summary: Mark a notification as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Marked as read
 */
router.put('/:id/read', markAsRead);

module.exports = router;
