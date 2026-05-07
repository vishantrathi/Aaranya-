import BlogPost from "../models/BlogPost.js";
import Offer from "../models/Offer.js";
import Product from "../models/Product.js";
import SiteContent from "../models/SiteContent.js";

const SYSTEM_PROMPT =
  "You are AARANYA's farm assistant for an ecommerce website. Be concise, practical, and polite. Help with products, freshness, delivery, payments, orders, and recipe ideas. If you do not know an exact account/order detail, ask the user to check their Orders page or contact support.";

const buildSearchTerms = (text) =>
  String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length >= 3)
    .slice(0, 10);

const buildRegex = (searchTerms) => {
  if (!searchTerms.length) {
    return null;
  }

  const escaped = searchTerms.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  return new RegExp(escaped.join("|"), "i");
};

const buildContextFromData = async (queryText) => {
  const terms = buildSearchTerms(queryText);
  const queryRegex = buildRegex(terms);

  if (!queryRegex) {
    return "";
  }

  const [products, offers, blogs, siteContent] = await Promise.all([
    Product.find({
      isActive: true,
      $or: [
        { name: queryRegex },
        { description: queryRegex },
        { category: queryRegex },
        { tags: queryRegex },
      ],
    })
      .select("name description price unit stock category tags")
      .limit(5)
      .lean(),
    Offer.find({
      isActive: true,
      $or: [{ title: queryRegex }, { offerText: queryRegex }],
    })
      .select("title offerText ctaLabel ctaPath")
      .sort({ priority: -1, createdAt: -1 })
      .limit(3)
      .lean(),
    BlogPost.find({
      isActive: true,
      $or: [{ title: queryRegex }, { excerpt: queryRegex }, { content: queryRegex }],
    })
      .select("title excerpt")
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(3)
      .lean(),
    SiteContent.findOne({ key: "primary" }).select("data.farmName data.location data.seasonal data.footer.contact").lean(),
  ]);

  const contextChunks = [];

  if (products.length) {
    contextChunks.push(
      `Products: ${products
        .map((item) => `${item.name} (₹${item.price}/${item.unit}, stock: ${item.stock}, category: ${item.category})`)
        .join(" | ")}`
    );
  }

  if (offers.length) {
    contextChunks.push(
      `Offers: ${offers.map((item) => `${item.title}: ${item.offerText}`).join(" | ")}`
    );
  }

  if (blogs.length) {
    contextChunks.push(
      `Blog highlights: ${blogs.map((item) => `${item.title}: ${item.excerpt}`).join(" | ")}`
    );
  }

  if (siteContent?.data) {
    const contact = siteContent.data.footer?.contact || {};
    const seasonal = siteContent.data.seasonal || {};
    contextChunks.push(
      `Store info: farm=${siteContent.data.farmName || "AARANYA"}, location=${siteContent.data.location || "N/A"}, seasonalTitle=${seasonal.title || ""}, whatsapp=${contact.whatsapp || ""}`
    );
  }

  return contextChunks.join("\n");
};

const pickFallbackReply = (message) => {
  const text = String(message || "").toLowerCase();

  if (text.includes("order") || text.includes("track") || text.includes("delivery")) {
    return "For order tracking, open My Orders in your account. If your order is delayed, share your order ID and we will help you quickly.";
  }

  if (text.includes("mango") || text.includes("fruit") || text.includes("seasonal")) {
    return "Mango lots are seasonal and limited. Check Shop for current stock, and place early for best variety and sweetness.";
  }

  if (text.includes("price") || text.includes("cost") || text.includes("discount") || text.includes("offer")) {
    return "Live prices and offers are updated in Shop and Offers. Add items to cart to see exact totals before checkout.";
  }

  if (text.includes("payment") || text.includes("razorpay") || text.includes("refund")) {
    return "You can pay securely during checkout. For payment issues or refunds, please share your order ID so support can verify quickly.";
  }

  return "I can help with products, stock, orders, delivery, and payments. Tell me what you need and I will guide you step by step.";
};

export const chatWithAssistant = async (req, res) => {
  const { message, history = [] } = req.body || {};

  if (!String(message || "").trim()) {
    res.status(400);
    throw new Error("message is required");
  }

  const cleanMessage = String(message).trim().slice(0, 1000);
  const safeHistory = Array.isArray(history)
    ? history
        .filter((item) => item && (item.role === "user" || item.role === "assistant") && typeof item.content === "string")
        .slice(-8)
        .map((item) => ({ role: item.role, content: item.content.slice(0, 1000) }))
    : [];

  const apiKey = process.env.OPENAI_API_KEY;
  let dataContext = "";

  try {
    dataContext = await buildContextFromData(cleanMessage);
  } catch {
    dataContext = "";
  }

  if (!apiKey) {
    const fallback = pickFallbackReply(cleanMessage);
    if (dataContext) {
      return res.json({
        reply: `${fallback}\n\nI also found related store data that can help: ${dataContext}`,
        mode: "fallback",
      });
    }

    return res.json({ reply: fallback, mode: "fallback" });
  }

  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  const payload = {
    model,
    temperature: 0.4,
    messages: [
      {
        role: "system",
        content: `${SYSTEM_PROMPT}\nUse provided MANUAL_SEARCH_CONTEXT when relevant. If context is empty, answer generally and suggest checking Shop or My Orders for exact status.`,
      },
      ...(dataContext ? [{ role: "system", content: `MANUAL_SEARCH_CONTEXT:\n${dataContext}` }] : []),
      ...safeHistory,
      { role: "user", content: cleanMessage },
    ],
  };

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const details = await response.text();
    res.status(502);
    throw new Error(`AI provider request failed: ${details}`);
  }

  const data = await response.json();
  const reply = data?.choices?.[0]?.message?.content?.trim();

  if (!reply) {
    return res.json({ reply: pickFallbackReply(cleanMessage), mode: "fallback" });
  }

  return res.json({ reply, mode: "ai" });
};
