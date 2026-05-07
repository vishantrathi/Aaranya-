import Order from "../models/Order.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";

export const createOrder = async (req, res) => {
  const { items, shippingAddress } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error("No order items");
  }

  if (!shippingAddress || !shippingAddress.trim()) {
    res.status(400);
    throw new Error("Shipping address is required");
  }

  let totalAmount = 0;
  const normalizedItems = [];

  for (const item of items) {
    const quantity = Number(item.quantity);
    if (!Number.isInteger(quantity) || quantity <= 0) {
      res.status(400);
      throw new Error("Each order item must include a valid positive quantity");
    }

    const hasValidProductId =
      typeof item.product === "string" && mongoose.Types.ObjectId.isValid(item.product);

    if (hasValidProductId) {
      const product = await Product.findById(item.product);
      if (!product) {
        res.status(404);
        throw new Error(`Product not found: ${item.product}`);
      }

      if (product.stock < quantity) {
        res.status(400);
        throw new Error(`Insufficient stock for ${product.name}`);
      }

      totalAmount += product.price * quantity;

      normalizedItems.push({
        product: product._id,
        quantity,
        name: product.name,
        image: product.image,
        price: product.price,
      });

      continue;
    }

    const name = typeof item.name === "string" ? item.name.trim() : "";
    const image = typeof item.image === "string" ? item.image.trim() : "";
    const price = Number(item.price);

    if (!name || !image || !Number.isFinite(price) || price <= 0) {
      res.status(400);
      throw new Error("Guest checkout items must include valid name, image, and price");
    }

    totalAmount += price * quantity;

    normalizedItems.push({
      quantity,
      name,
      image,
      price,
    });
  }

  const order = await Order.create({
    user: req.user?._id,
    items: normalizedItems,
    shippingAddress,
    totalAmount,
  });

  res.status(201).json(order);
};

export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
};

export const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate("user", "name email");

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  const orderUserId = order.user?._id?.toString?.();
  if (orderUserId && orderUserId !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Unauthorized to view this order");
  }

  res.json(order);
};

export const updateOrderStatus = async (req, res) => {
  const { orderStatus } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  const allowedStatuses = ["Pending", "Confirmed", "Delivered", "Undelivered", "Failed"];
  if (orderStatus && !allowedStatuses.includes(orderStatus)) {
    res.status(400);
    throw new Error("Invalid order status");
  }

  order.orderStatus = orderStatus || order.orderStatus;
  const updated = await order.save();

  res.json(updated);
};

export const getAllOrders = async (_req, res) => {
  const orders = await Order.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });
  res.json(orders);
};
