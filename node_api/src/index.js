const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const { seedData } = require('../scripts/seeder');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Database connection with fallback to Memory Server
const connectDB = async () => {
    const defaultUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/portbuoy';

    try {
        console.log(`Attempting to connect to MongoDB at ${defaultUri}...`);
        // We set a short timeout here to quickly fallback if MongoDB is not locally running
        const conn = await mongoose.connect(defaultUri, {
            serverSelectionTimeoutMS: 2000
        });
        console.log(`✅ Default MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.warn(`\n⚠️  Failed to connect to local MongoDB. Falling back to In-Memory MongoDB Server for MVP testing...`);
        try {
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongoServer = await MongoMemoryServer.create();
            const memoryUri = mongoServer.getUri();

            const conn = await mongoose.connect(memoryUri);
            console.log(`✅ In-Memory MongoDB Connected: ${conn.connection.host}`);

            // Automatically run the seeder so the in-memory database has data!
            console.log(`🌱 Seeding In-Memory Database with sample MVP data...`);
            await seedData(false); // pass false so process doesn't exit
            console.log(`🌱 Seed completion successful.`);

        } catch (memError) {
            console.error(`❌ Fatal Error connecting to In-Memory MongoDB: ${memError.message}`);
            process.exit(1);
        }
    }
};

// Route Definitions
const authRoutes = require('./routes/authRoutes');
const truckRoutes = require('./routes/truckRoutes');
const slotRoutes = require('./routes/slotRoutes');
const adminRoutes = require('./routes/adminRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/trucks', truckRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'PortBuoy API is running' });
});

// Start server
const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`\n🚀 Server running on port ${PORT}`);
        console.log(`📚 Swagger docs available at http://localhost:${PORT}/api-docs`);
    });
};

if (require.main === module) {
    startServer();
}

module.exports = app;
