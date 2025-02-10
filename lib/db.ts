import mongoose from 'mongoose';
/* eslint-disable no-var */
declare global {
  var mongooseCache: { connection: typeof mongoose | null, isConnected: boolean };
}

global.mongooseCache = global.mongooseCache || { connection: null, isConnected: false };

export async function connect() {
  if (global.mongooseCache.isConnected) {
    console.log("Using cached database connection");
    return;
  }

  try {
    const connection = await mongoose.connect(process.env.MONGODB_URL!, {
      maxPoolSize: 10, // Enable pooling
      connectTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000, // 45 seconds
    });

    global.mongooseCache = {
      connection,
      isConnected: true,
    };

    console.log("Connected to DB");
  } catch (error) {
    console.error("Database connection error:", error);
    throw new Error("Could not connect to the database.");
  }
}
