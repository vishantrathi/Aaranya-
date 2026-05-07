import mongoose from "mongoose";

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    excerpt: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    isActive: { type: Boolean, default: true },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("BlogPost", blogPostSchema);
