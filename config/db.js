const mongoose = require('mongoose');

// Cache the connection to reuse in serverless
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
    try {
        // Check if MONGODB_URI is provided
        if (!process.env.MONGODB_URI) {
            console.error('❌ MONGODB_URI is not defined in environment variables');
            // Don't crash in serverless, just return
            return;
        }

        // If already connected, return cached connection
        if (cached.conn) {
            return cached.conn;
        }

        // If connection is in progress, wait for it
        if (!cached.promise) {
            const opts = {
                bufferCommands: false,
            };

            cached.promise = mongoose.connect(process.env.MONGODB_URI, opts).then((mongoose) => {
                console.log('✅ Connected to MongoDB Atlas');
                return mongoose;
            }).catch((err) => {
                console.error('❌ Failed to connect to MongoDB: ', err.message);
                cached.promise = null;
                throw err;
            });
        }

        cached.conn = await cached.promise;
        return cached.conn;
    } catch (err) {
        console.error('❌ MongoDB connection error: ', err.message);
        // Don't crash the serverless function
        return null;
    }
};

module.exports = connectDB;

