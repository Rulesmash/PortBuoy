const mongoose = require('mongoose');

const emissionRecordSchema = new mongoose.Schema(
    {
        booking: {
            type: mongoose.Schema.ObjectId,
            ref: 'Booking',
            required: true,
        },
        idleTime: {
            type: Number, // In minutes
            required: true,
        },
        emissionProduced: {
            type: Number, // Total emissions produced during this idle window (kg CO2e)
            required: true,
        },
        emissionSaved: {
            type: Number, // Difference between actual vs baseline projected emission
            required: true,
            default: 0,
        },
        recordedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

const EmissionRecord = mongoose.model('EmissionRecord', emissionRecordSchema);
module.exports = EmissionRecord;
