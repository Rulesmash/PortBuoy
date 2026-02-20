const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema(
    {
        startTime: {
            type: Date,
            required: [true, 'Please provide a start time'],
        },
        endTime: {
            type: Date,
            required: [true, 'Please provide an end time'],
        },
        maxTrucks: {
            type: Number,
            required: true,
            min: 1,
        },
        bookedCount: {
            type: Number,
            default: 0,
            min: 0,
        },
        congestionScore: {
            type: Number,
            default: 0,
            min: 0,
            max: 1, // Represents 0% to 100% capacity/congestion
        },
    },
    {
        timestamps: true,
    }
);

// Method to check if slot has capacity
slotSchema.methods.hasCapacity = function () {
    return this.bookedCount < this.maxTrucks;
};

// Auto update congestion score before save
slotSchema.pre('save', function (next) {
    if (this.maxTrucks > 0) {
        this.congestionScore = this.bookedCount / this.maxTrucks;
    }
    next();
});

const Slot = mongoose.model('Slot', slotSchema);
module.exports = Slot;
