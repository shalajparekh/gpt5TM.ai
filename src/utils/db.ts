import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  // Intentionally not throwing at import-time to allow build to pass without envs.
  // API routes will error if called without this variable.
  console.warn("MONGODB_URI is not set. Set it in your environment to enable DB.");
}

type GlobalWithMongoose = typeof globalThis & {
  mongooseConn?: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
};

const globalWithMongoose = global as GlobalWithMongoose;

export async function connectToDatabase() {
  if (!MONGODB_URI) throw new Error("Missing MONGODB_URI env var");

  if (!globalWithMongoose.mongooseConn) {
    globalWithMongoose.mongooseConn = { conn: null, promise: null };
  }
  if (globalWithMongoose.mongooseConn.conn) return globalWithMongoose.mongooseConn.conn;
  if (!globalWithMongoose.mongooseConn.promise) {
    globalWithMongoose.mongooseConn.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: process.env.MONGODB_DB || "techmaadi",
      })
      .then((m) => m);
  }
  globalWithMongoose.mongooseConn.conn = await globalWithMongoose.mongooseConn.promise;
  return globalWithMongoose.mongooseConn.conn;
}


