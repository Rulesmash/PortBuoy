const Truck = require('../models/Truck');

// @desc    Add a new truck
// @route   POST /api/trucks
// @access  Private (Operator, Driver)
exports.addTruck = async (req, res) => {
    try {
        req.body.owner = req.user.id;

        const truck = await Truck.create(req.body);

        res.status(201).json({ success: true, data: truck });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, error: 'Truck with this number plate already exists' });
        }
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Get all trucks for logged in user (or all if admin)
// @route   GET /api/trucks
// @access  Private
exports.getTrucks = async (req, res) => {
    try {
        let query;

        // Admin sees all, others see their own
        if (req.user.role === 'admin') {
            query = Truck.find().populate('owner', 'name email companyName');
        } else {
            query = Truck.find({ owner: req.user.id });
        }

        const trucks = await query;

        res.status(200).json({ success: true, count: trucks.length, data: trucks });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Update truck
// @route   PUT /api/trucks/:id
// @access  Private
exports.updateTruck = async (req, res) => {
    try {
        let truck = await Truck.findById(req.params.id);

        if (!truck) {
            return res.status(404).json({ success: false, error: 'Truck not found' });
        }

        // Make sure user is truck owner or admin
        if (truck.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'Not authorized to update this truck' });
        }

        truck = await Truck.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: truck });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Delete truck
// @route   DELETE /api/trucks/:id
// @access  Private
exports.deleteTruck = async (req, res) => {
    try {
        const truck = await Truck.findById(req.params.id);

        if (!truck) {
            return res.status(404).json({ success: false, error: 'Truck not found' });
        }

        // Make sure user is truck owner or admin
        if (truck.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'Not authorized to delete this truck' });
        }

        await truck.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
