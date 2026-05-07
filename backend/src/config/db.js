import mongoose from "mongoose";

const MONGO_STATE = {
  0: "disconnected",
  1: "connected",
  2: "connecting",
  3: "disconnecting",
};

export const getDbHealth = () => {
  const stateCode = mongoose.connection.readyState;
  return {
    connected: stateCode === 1,
    state: MONGO_STATE[stateCode] || "unknown",
  };
};

export const connectDB = async () => {
  const mongoUri =
    process.env.MONGODB_URI ||
    process.env.MONGO_URI ||
    process.env.DB_URI ||
    "mongodb://127.0.0.1:27017/aaranya";

  if (!process.env.MONGODB_URI && !process.env.MONGO_URI && !process.env.DB_URI) {
    console.warn(
      "MONGODB_URI is not set. Falling back to local MongoDB at mongodb://127.0.0.1:27017/aaranya"
    );
  }

  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    return false;
  }
};
