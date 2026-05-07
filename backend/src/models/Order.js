import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: false },
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    items: [orderItemSchema],
    shippingAddress: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["Unpaid", "Paid", "Failed"],
      default: "Unpaid",
    },
    orderStatus: {
      type: String,
      enum: ["Pending", "Confirmed", "Delivered", "Undelivered", "Failed"],
      default: "Pending",
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    paidAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
