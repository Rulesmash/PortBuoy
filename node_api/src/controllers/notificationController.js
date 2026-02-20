const Notification = require('../models/Notification');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user.id }).sort('-createdAt');
        res.status(200).json({ success: true, count: notifications.length, data: notifications });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Create notification (Internal utility or Admin trigger)
// @route   POST /api/notifications
// @access  Private (Admin)
exports.createNotification = async (req, res) => {
    try {
        const { user, type, message } = req.body;

        const notification = await Notification.create({
            user, type, message
        });

        res.status(201).json({ success: true, data: notification });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res) => {
    try {
        let notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({ success: false, error: 'Notification not found' });
        }

        // Must own notification
        if (notification.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'Not authorized' });
        }

        notification.read = true;
        await notification.save();

        res.status(200).json({ success: true, data: notification });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
