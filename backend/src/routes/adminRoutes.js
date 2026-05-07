import express from "express";

import {
  getCustomerMetrics,
  getDashboardStats,
  getUsers,
  updateUserRole,
} from "../controllers/adminController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", protect, adminOnly, getDashboardStats);
router.get("/users", protect, adminOnly, getUsers);
router.get("/customers", protect, adminOnly, getCustomerMetrics);
router.put("/users/:id/role", protect, adminOnly, updateUserRole);

export default router;
