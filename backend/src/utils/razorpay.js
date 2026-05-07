import Razorpay from "razorpay";

export const getRazorpayClient = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    const error = new Error("Razorpay is not configured");
    error.statusCode = 500;
    throw error;
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};
