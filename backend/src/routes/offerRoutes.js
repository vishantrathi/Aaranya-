import express from "express";

import {
  createOffer,
  deleteOffer,
  getAdminOffers,
  getPublicOffers,
  updateOffer,
} from "../controllers/offerController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getPublicOffers);
router.get("/admin", protect, adminOnly, getAdminOffers);
router.post("/admin", protect, adminOnly, createOffer);
router.put("/admin/:id", protect, adminOnly, updateOffer);
router.delete("/admin/:id", protect, adminOnly, deleteOffer);

export default router;
