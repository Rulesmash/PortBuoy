const mongoose = require('mongoose');

const truckSchema = new mongoose.Schema(
    {
        numberPlate: {
            type: String,
            required: [true, 'Please provide a number plate'],
            unique: true,
            trim: true,
            uppercase: true,
        },
        fuelType: {
            type: String,
            enum: ['diesel', 'electric', 'LNG'],
            required: [true, 'Please define fuel type (diesel, electric, LNG)'],
        },
        avgFuelBurnRate: {
            type: Number,
            required: [true, 'Average fuel burn rate (liters/hour) is required'],
            min: 0,
        },
        owner: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Truck = mongoose.model('Truck', truckSchema);
module.exports = Truck;
