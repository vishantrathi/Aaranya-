import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    offerText: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    placement: {
      type: String,
      enum: ["home", "blog"],
      required: true,
      default: "home",
    },
    ctaLabel: { type: String, default: "Explore" },
    ctaPath: { type: String, default: "/shop" },
    priority: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    startAt: { type: Date, default: null },
    endAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("Offer", offerSchema);
