export const validateEnv = () => {
  const isProduction = process.env.NODE_ENV === "production";

  if (!process.env.JWT_SECRET?.trim()) {
    if (isProduction) {
      throw new Error("Missing required environment variable: JWT_SECRET");
    }

    process.env.JWT_SECRET = "dev-insecure-jwt-secret-change-me";
    console.warn("JWT_SECRET is not set. Using an insecure development fallback secret.");
  }

  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.warn("Razorpay keys are not set. Payment routes will fail until configured.");
  }

  if (!process.env.OPENAI_API_KEY) {
    console.warn("OPENAI_API_KEY is not set. Chatbot will run in fallback mode.");
  }
};
