import crypto from "crypto";

import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { getRazorpayClient } from "../utils/razorpay.js";

export const createRazorpayOrder = async (req, res) => {
  const { orderId } = req.body;
  const razorpayClient = getRazorpayClient();

  const order = await Order.findById(orderId);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (order.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Unauthorized to pay for this order");
  }

  if (order.paymentStatus === "Paid") {
    res.status(400);
    throw new Error("Order is already paid");
  }

  if (!order.items || order.items.length === 0) {
    res.status(400);
    throw new Error("Order has no items for payment");
  }

  const razorpayOrder = await razorpayClient.orders.create({
    amount: Math.round(order.totalAmount * 100),
    currency: "INR",
    receipt: `order_${order._id}`,
    notes: { userId: req.user._id.toString() },
  });

  order.razorpayOrderId = razorpayOrder.id;
  await order.save();

  res.json({
    razorpayOrder,
    key: process.env.RAZORPAY_KEY_ID,
  });
};

export const verifyRazorpayPayment = async (req, res) => {
  const {
    orderId,
    razorpay_order_id: razorpayOrderId,
    razorpay_payment_id: razorpayPaymentId,
    razorpay_signature: razorpaySignature,
  } = req.body;

  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  if (generatedSignature !== razorpaySignature) {
    res.status(400);
    throw new Error("Payment signature verification failed");
  }

  const order = await Order.findById(orderId);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (order.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Unauthorized to verify this order");
  }

  if (!order.razorpayOrderId || order.razorpayOrderId !== razorpayOrderId) {
    res.status(400);
    throw new Error("Razorpay order mismatch");
  }

  if (order.paymentStatus === "Paid") {
    return res.json({ message: "Payment already verified", order });
  }

  const quantityByProduct = order.items.reduce((acc, item) => {
    const productId = item.product.toString();
    acc[productId] = (acc[productId] || 0) + item.quantity;
    return acc;
  }, {});

  const productIds = Object.keys(quantityByProduct);
  const products = await Product.find({ _id: { $in: productIds } });
  const productById = new Map(products.map((product) => [product._id.toString(), product]));

  for (const productId of productIds) {
    const product = productById.get(productId);
    if (!product) {
      res.status(404);
      throw new Error("Product not found while confirming payment");
    }

    const requiredQty = quantityByProduct[productId];
    if (product.stock < requiredQty) {
      res.status(400);
      throw new Error(`Insufficient stock for ${product.name} while confirming payment`);
    }
  }

  for (const productId of productIds) {
    const product = productById.get(productId);
    product.stock -= quantityByProduct[productId];
    await product.save();
  }

  order.paymentStatus = "Paid";
  order.orderStatus = order.orderStatus === "Pending" ? "Confirmed" : order.orderStatus;
  order.razorpayPaymentId = razorpayPaymentId;
  order.paidAt = new Date();

  await order.save();

  res.json({ message: "Payment verified", order });
};
