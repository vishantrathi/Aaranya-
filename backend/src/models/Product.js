import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    image: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    unit: { type: String, default: "kg" },
    category: {
      type: String,
      enum: ["fruits", "vegetables", "grains", "organic", "non-organic"],
      required: true,
    },
    tags: [{ type: String }],
    isFeaturedMango: { type: Boolean, default: false },
    isOrganic: { type: Boolean, default: false },
    isInSeason: { type: Boolean, default: false },
    stock: { type: Number, required: true, default: 0, min: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
