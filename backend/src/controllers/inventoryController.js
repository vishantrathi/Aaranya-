import InventoryLog from "../models/InventoryLog.js";
import Product from "../models/Product.js";

export const adjustInventory = async (req, res) => {
  const { productId, delta, reason } = req.body;

  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const nextStock = product.stock + Number(delta);

  if (nextStock < 0) {
    res.status(400);
    throw new Error("Stock cannot be negative");
  }

  const previousStock = product.stock;
  product.stock = nextStock;
  await product.save();

  const log = await InventoryLog.create({
    product: product._id,
    changedBy: req.user._id,
    delta,
    reason: reason || "Manual adjustment",
    previousStock,
    nextStock,
  });

  res.json({ product, log });
};

export const getInventoryLogs = async (_req, res) => {
  const logs = await InventoryLog.find()
    .populate("product", "name")
    .populate("changedBy", "name")
    .sort({ createdAt: -1 });

  res.json(logs);
};
