const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config();

// Load models
const User = require('../src/models/User');
const Truck = require('../src/models/Truck');
const Slot = require('../src/models/Slot');
const Booking = require('../src/models/Booking');
const VesselSchedule = require('../src/models/VesselSchedule');
const EmissionRecord = require('../src/models/EmissionRecord');

// Connect to DB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portbuoy', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const seedData = async () => {
    try {
        console.log('Clearing database...');
        await User.deleteMany();
        await Truck.deleteMany();
        await Slot.deleteMany();
        await Booking.deleteMany();
        await VesselSchedule.deleteMany();
        await EmissionRecord.deleteMany();

        console.log('Creating Admin & Operators...');
        const adminPass = await bcrypt.hash('password123', 10);

        const users = await User.insertMany([
            { name: 'Admin One', email: 'admin@portbuoy.com', password: adminPass, role: 'admin' },
            { name: 'Fleet Operator', email: 'operator@logistics.com', password: adminPass, role: 'operator', companyName: 'Global Logistics' },
            { name: 'Driver John', email: 'john@logistics.com', password: adminPass, role: 'driver' },
            { name: 'Driver Sarah', email: 'sarah@freight.com', password: adminPass, role: 'driver' },
            { name: 'Driver Mike', email: 'mike@delivery.com', password: adminPass, role: 'driver' }
        ]);

        console.log('Creating Trucks...');
        const operatorId = users[1]._id;
        let trucks = [];

        // Generate 50 trucks
        const fuelTypes = ['diesel', 'electric', 'LNG'];
        for (let i = 1; i <= 50; i++) {
            trucks.push({
                numberPlate: `TRK-10${i.toString().padStart(2, '0')}`,
                fuelType: fuelTypes[Math.floor(Math.random() * fuelTypes.length)],
                avgFuelBurnRate: Math.floor(Math.random() * 8) + 3, // 3 to 10 liters/hr
                owner: i <= 25 ? operatorId : users[Math.floor(Math.random() * 3) + 2]._id // Assign to operator or drivers
            });
        }
        const createdTrucks = await Truck.insertMany(trucks);

        console.log('Creating 20 Slots for today...');
        let slots = [];
        const today = new Date();
        today.setHours(6, 0, 0, 0); // Start at 6 AM

        for (let i = 0; i < 20; i++) {
            const start = new Date(today);
            start.setHours(start.getHours() + i);
            const end = new Date(start);
            end.setHours(start.getHours() + 1);

            slots.push({
                startTime: start,
                endTime: end,
                maxTrucks: Math.floor(Math.random() * 10) + 5, // 5 to 14 trucks per slot max
                bookedCount: 0
            });
        }
        const createdSlots = await Slot.insertMany(slots);

        console.log('Creating 3 Vessel Scenarios...');
        await VesselSchedule.insertMany([
            { vesselName: 'Ever Given', arrivalTime: new Date(new Date().setHours(10)), berth: 'Berth 1', delayRiskScore: 85, status: 'delayed' },
            { vesselName: 'Maersk Mc-Kinney', arrivalTime: new Date(new Date().setHours(14)), berth: 'Berth 2', delayRiskScore: 10, status: 'scheduled' },
            { vesselName: 'MSC Oscar', arrivalTime: new Date(new Date().setHours(8)), berth: 'Berth 3', delayRiskScore: 45, status: 'docked' }
        ]);

        console.log('Creating Sample Bookings & Emissions...');
        for (let i = 0; i < 15; i++) {
            const truck = createdTrucks[i];
            const slot = createdSlots[i % 5]; // distribute among first 5 slots

            slot.bookedCount += 1; // pre-save will recalc congestion

            const idleTime = Math.floor(Math.random() * 45) + 15; // 15 to 60 mins
            const booking = await Booking.create({
                truck: truck._id,
                slot: slot._id,
                driver: truck.owner,
                status: 'completed',
                estimatedIdleTime: idleTime
            });

            // simulated emission math
            const produced = (idleTime / 60) * truck.avgFuelBurnRate * 2.68; // approx diesel factor
            const saved = (60 / 60) * truck.avgFuelBurnRate * 2.68 - produced;

            await EmissionRecord.create({
                booking: booking._id,
                idleTime,
                emissionProduced: produced > 0 ? produced : 0,
                emissionSaved: saved > 0 ? saved : 0
            });
        }

        // Save slot counts and trigger hooks
        for (let i = 0; i < 5; i++) {
            await createdSlots[i].save();
        }

        console.log('Seeding Success!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seedData();
