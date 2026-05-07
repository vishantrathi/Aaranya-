import mongoose from "mongoose";

const inventoryLogSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    delta: { type: Number, required: true },
    reason: { type: String, default: "Manual update" },
    previousStock: { type: Number, required: true },
    nextStock: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("InventoryLog", inventoryLogSchema);
