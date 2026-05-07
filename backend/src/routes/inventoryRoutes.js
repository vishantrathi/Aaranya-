import express from "express";

import {
  adjustInventory,
  getInventoryLogs,
} from "../controllers/inventoryController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/adjust", protect, adminOnly, adjustInventory);
router.get("/logs", protect, adminOnly, getInventoryLogs);

export default router;
