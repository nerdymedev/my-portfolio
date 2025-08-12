import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  // During build time, MONGODB_URI might not be available
  // This is acceptable for static generation
  if (process.env.NODE_ENV === 'production' && !process.env.VERCEL_URL) {
    console.warn('MONGODB_URI not available during build time')
  } else {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env.local'
    )
  }
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose as { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null }

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn
  }

  // Handle case where MONGODB_URI is not available (e.g., during build)
  if (!MONGODB_URI) {
    throw new Error('Database connection not available')
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts)
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default dbConnect