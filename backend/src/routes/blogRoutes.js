import express from "express";

import {
  createBlog,
  deleteBlog,
  getAdminBlogs,
  getPublicBlogs,
  updateBlog,
} from "../controllers/blogController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getPublicBlogs);
router.get("/admin", protect, adminOnly, getAdminBlogs);
router.post("/admin", protect, adminOnly, createBlog);
router.put("/admin/:id", protect, adminOnly, updateBlog);
router.delete("/admin/:id", protect, adminOnly, deleteBlog);

export default router;
