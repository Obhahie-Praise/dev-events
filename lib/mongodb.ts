import mongoose from 'mongoose';

// Define the MongoDB connection URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

// Define TypeScript interface for cached connection
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend global type to include mongoose cache
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

// Initialize cache object to store connection across hot reloads
let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

/**
 * Establishes and returns a cached MongoDB connection using Mongoose
 * 
 * In development, Next.js hot reloading can create multiple connections.
 * This function prevents that by caching the connection in the global scope.
 * 
 * @returns {Promise<typeof mongoose>} The Mongoose instance with active connection
 */
async function connectDB(): Promise<typeof mongoose> {
  // Return existing connection if already established
  if (cached.conn) {
    return cached.conn;
  }

  // Return existing connection promise if connection is in progress
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable command buffering for immediate errors
    };

    // Create new connection promise
    cached.promise = mongoose.connect(MONGODB_URI as string, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    // Wait for connection to complete and cache it
    cached.conn = await cached.promise;
  } catch (e) {
    // Clear promise on error to allow retry
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
