const Booking = require('../models/Booking');
const Truck = require('../models/Truck');
const EmissionRecord = require('../models/EmissionRecord');
const Slot = require('../models/Slot');

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
exports.getDashboardStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // 1. Total bookings today
        const totalBookingsToday = await Booking.countDocuments({
            createdAt: { $gte: today, $lt: tomorrow }
        });

        // 2. Total active trucks in system
        const activeTrucks = await Truck.countDocuments();

        // 3. Average Turnaround (Idle) Time (from Bookings today)
        const bookingsToday = await Booking.find({
            createdAt: { $gte: today, $lt: tomorrow }
        });

        let avgTurnaroundTime = 0;
        if (bookingsToday.length > 0) {
            const totalIdle = bookingsToday.reduce((acc, curr) => acc + curr.estimatedIdleTime, 0);
            avgTurnaroundTime = Math.floor(totalIdle / bookingsToday.length);
        }

        // 4. Total Emissions Saved
        const emissionRecords = await EmissionRecord.find({});
        const totalEmissionsSaved = emissionRecords.reduce((acc, curr) => acc + curr.emissionSaved, 0);

        // 5. Congestion Trend (upcoming slots)
        const upcomingSlots = await Slot.find({ startTime: { $gte: new Date() } })
            .sort('startTime').limit(5);

        const congestionTrend = upcomingSlots.map(slot => ({
            time: slot.startTime,
            score: slot.congestionScore,
            booked: slot.bookedCount,
            capacity: slot.maxTrucks
        }));

        res.status(200).json({
            success: true,
            data: {
                totalBookingsToday,
                activeTrucks,
                avgTurnaroundTimeMins: avgTurnaroundTime,
                totalEmissionsSavedKg: parseFloat(totalEmissionsSaved.toFixed(2)),
                congestionTrend
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
