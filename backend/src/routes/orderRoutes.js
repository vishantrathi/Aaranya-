import express from "express";

import {
  createOrder,
  getAllOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", createOrder);
router.get("/my", protect, getMyOrders);
router.get("/:id", protect, getOrderById);
router.get("/", protect, adminOnly, getAllOrders);
router.put("/:id/status", protect, adminOnly, updateOrderStatus);

export default router;
