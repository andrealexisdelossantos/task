const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Check if MONGODB_URI is provided
        if (!process.env.MONGODB_URI) {
            console.error('❌ MONGODB_URI is not defined in environment variables');
            console.log('⚠️  Please create a .env file with MONGODB_URI');
            // Don't exit in development, allow server to start for testing other features
            if (process.env.NODE_ENV === 'production') {
                process.exit(1);
            }
            return;
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB Atlas');
    } catch (err) {
        console.error('❌ Failed to connect to MongoDB: ', err.message);
        // In production, exit on connection failure
        if (process.env.NODE_ENV === 'production') {
            process.exit(1);
        } else {
            console.log('⚠️  Server will continue without database connection (development mode)');
        }
    }
};

module.exports = connectDB;
