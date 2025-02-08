import mongoose from "mongoose";

// check if MONGODB_URI is defined
const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

// check if cached connection is available
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// connect to database

export async function connectToDatabase() {
  // check if connection is already established
  if (cached.conn) {
    return cached.conn;
  }

  // check if promise is available or not
  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
      maxPoolSize: 10,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then(() => mongoose.connection);
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    throw new Error(`Mongoose connection error: ${error}`);
  }
}
