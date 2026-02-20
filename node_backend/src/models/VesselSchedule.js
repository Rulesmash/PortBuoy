const mongoose = require('mongoose');

const vesselScheduleSchema = new mongoose.Schema(
    {
        vesselName: {
            type: String,
            required: [true, 'Please provide the vessel name'],
            trim: true,
        },
        arrivalTime: {
            type: Date,
            required: [true, 'Please provide the vessel arrival time'],
        },
        berth: {
            type: String,
            required: [true, 'Please declare the berth assignment'],
        },
        delayRiskScore: {
            type: Number,
            default: 0,
            min: 0,
            max: 100, // 0 = low risk, 100 = high risk of delay
        },
        status: {
            type: String,
            enum: ['scheduled', 'delayed', 'docked'],
            default: 'scheduled',
        },
    },
    {
        timestamps: true,
    }
);

const VesselSchedule = mongoose.model('VesselSchedule', vesselScheduleSchema);
module.exports = VesselSchedule;
