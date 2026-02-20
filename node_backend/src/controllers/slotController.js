const Slot = require('../models/Slot');
const Booking = require('../models/Booking');
const VesselSchedule = require('../models/VesselSchedule');
const Truck = require('../models/Truck');

// @desc    Create a new slot slot
// @route   POST /api/slots
// @access  Private (Admin)
exports.createSlot = async (req, res) => {
    try {
        const slot = await Slot.create(req.body);
        res.status(201).json({ success: true, data: slot });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Get all active slots
// @route   GET /api/slots
// @access  Private
exports.getSlots = async (req, res) => {
    try {
        const slots = await Slot.find({ startTime: { $gte: new Date() } }).sort('startTime');
        res.status(200).json({ success: true, count: slots.length, data: slots });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Simulate Congestion Scoring Algorithm
// @route   GET /api/slots/:id/congestion
// @access  Private
exports.getCongestionPrediction = async (req, res) => {
    try {
        const slot = await Slot.findById(req.params.id);
        if (!slot) return res.status(404).json({ success: false, error: 'Slot not found' });

        // Fetch active vessels to factor in yard utilization simulation
        const vessels = await VesselSchedule.find({ status: { $in: ['scheduled', 'docked'] } });
        const avgDelayRisk = vessels.length > 0
            ? vessels.reduce((acc, v) => acc + v.delayRiskScore, 0) / (vessels.length * 100)
            : 0;

        // Simulated Yard Utilization (randomized between 40 - 90 % for MVP)
        const yardUtilization = Math.floor(Math.random() * 50) + 40;

        // Base slot capacity logic
        const slotCapacityRatio = slot.bookedCount / slot.maxTrucks;

        // Formula defined in Prompt:
        // CongestionScore = (slotCapacityRatio * 0.6) + (yardUtilization / 100 * 0.3) + (avgDelayRisk * 0.1)
        const rawScore = (slotCapacityRatio * 0.6) + ((yardUtilization / 100) * 0.3) + (avgDelayRisk * 0.1);

        let level = 'Low';
        if (rawScore > 0.8) level = 'High';
        else if (rawScore > 0.5) level = 'Medium';

        // Suggest best alternate slot if high
        let recommendedSlot = null;
        if (level === 'High') {
            recommendedSlot = await Slot.findOne({
                startTime: { $gte: slot.endTime },
                $expr: { $lt: ["$bookedCount", "$maxTrucks"] }
            }).sort('startTime');
        }

        res.status(200).json({
            success: true,
            data: {
                targetSlot: slot._id,
                congestionScore: parseFloat(rawScore.toFixed(2)),
                congestionLevel: level,
                factors: {
                    capacityRatio: parseFloat(slotCapacityRatio.toFixed(2)),
                    yardUtilizationPercentage: yardUtilization,
                    vesselDelayRiskFactor: parseFloat(avgDelayRisk.toFixed(2))
                },
                recommendedRetrySlot: recommendedSlot ? recommendedSlot._id : null
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Book a slot
// @route   POST /api/slots/:id/book
// @access  Private (Driver, Operator)
exports.bookSlot = async (req, res) => {
    try {
        const slot = await Slot.findById(req.params.id);
        const { truckId } = req.body;

        if (!slot) return res.status(404).json({ success: false, error: 'Slot not found' });

        // Prevent overbooking
        if (!slot.hasCapacity()) {
            return res.status(400).json({ success: false, error: 'Slot is fully booked' });
        }

        // Validate Truck
        const truck = await Truck.findById(truckId);
        if (!truck) return res.status(404).json({ success: false, error: 'Truck not found' });

        if (truck.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'Not authorized to book this truck' });
        }

        // Check if truck already booked in this slot
        const existingBooking = await Booking.findOne({ truck: truck._id, slot: slot._id, status: { $ne: 'cancelled' } });
        if (existingBooking) {
            return res.status(400).json({ success: false, error: 'This truck is already booked for this slot' });
        }

        // Base Idle time simulation dependent on current congestion vs empty port
        const estimatedIdleTime = Math.floor(15 + (slot.congestionScore * 60)); // 15 mins base + up to 60 mins delay 

        const booking = await Booking.create({
            truck: truck._id,
            slot: slot._id,
            driver: req.user.id,
            estimatedIdleTime
        });

        // Update slot booked count
        slot.bookedCount += 1;
        await slot.save(); // pre-save hook updates congestion score

        res.status(201).json({ success: true, data: booking });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
