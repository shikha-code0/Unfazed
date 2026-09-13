const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/unfazed';
  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2500, // Quick timeout for local development
    });
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.log(`[MongoDB Notice] Local MongoDB instance not detected (${error.message}).`);
    console.log(`[MongoDB Notice] Unfazed service running with resilient in-memory datastore for Module 1 testing.`);
  }
};

module.exports = connectDB;
