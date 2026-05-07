import dotenv from "dotenv";

import app from "./app.js";
import { connectDB } from "./config/db.js";
import { validateEnv } from "./config/env.js";

dotenv.config();
validateEnv();

const PORT = process.env.PORT || 5000;

const isDbConnected = await connectDB();

if (!isDbConnected) {
  console.warn("Starting API without an active MongoDB connection. Some routes may return errors until DB is available.");
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
