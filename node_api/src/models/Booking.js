const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
    {
        truck: {
            type: mongoose.Schema.ObjectId,
            ref: 'Truck',
            required: true,
        },
        slot: {
            type: mongoose.Schema.ObjectId,
            ref: 'Slot',
            required: true,
        },
        driver: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'completed', 'cancelled'],
            default: 'pending',
        },
        estimatedIdleTime: {
            type: Number, // in minutes
            default: 0,
            min: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
