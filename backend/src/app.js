import "express-async-errors";
import cors from "cors";
import express from "express";
import morgan from "morgan";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import offerRoutes from "./routes/offerRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import siteContentRoutes from "./routes/siteContentRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import { getDbHealth } from "./config/db.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  const db = getDbHealth();
  res.json({
    status: db.connected ? "ok" : "degraded",
    service: "Aaranya API",
    db,
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/site-content", siteContentRoutes);
app.use("/api/chat", chatRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
