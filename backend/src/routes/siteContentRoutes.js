import express from "express";

import { getSiteContent, updateSiteContent } from "../controllers/siteContentController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getSiteContent);
router.get("/admin", protect, adminOnly, getSiteContent);
router.put("/admin", protect, adminOnly, updateSiteContent);

export default router;