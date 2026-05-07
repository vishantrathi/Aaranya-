import Product from "../models/Product.js";

const allowedCategories = new Set(["fruits", "vegetables", "grains", "organic", "non-organic"]);

const categoryMap = {
  mangoes: "fruits",
  vegetables: "vegetables",
  "wheat grain": "grains",
  "wheat atta": "grains",
  "rice grain": "grains",
  "rice atta": "grains",
  seasonal: "organic",
  fruits: "fruits",
  grains: "grains",
  organic: "organic",
  "non-organic": "non-organic",
};

const normalizeCategory = (category) => {
  if (!category) return "organic";
  const key = String(category).trim().toLowerCase();
  return categoryMap[key] || (allowedCategories.has(key) ? key : "organic");
};

const slugify = (value) =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const makeUniqueSlug = async (name, currentProductId) => {
  const base = slugify(name) || `product-${Date.now()}`;
  let candidate = base;
  let counter = 1;

  while (true) {
    const existing = await Product.findOne({ slug: candidate });
    if (!existing || existing._id.toString() === currentProductId) {
      return candidate;
    }

    candidate = `${base}-${counter}`;
    counter += 1;
  }
};

export const getProducts = async (req, res) => {
  const { category, search, featured, includeOutOfStock } = req.query;

  const filter = { isActive: true };

  if (includeOutOfStock !== "true") {
    filter.stock = { $gt: 0 };
  }

  if (category && category !== "all") {
    filter.$or = [{ category }, { tags: category }];
  }

  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }

  if (featured === "mango") {
    filter.isFeaturedMango = true;
  }

  const products = await Product.find(filter).sort({ createdAt: -1 });
  res.json(products);
};

export const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.json(product);
};

export const createProduct = async (req, res) => {
  const payload = { ...req.body };

  payload.category = normalizeCategory(payload.category);
  payload.slug = await makeUniqueSlug(payload.slug || payload.name);

  if (payload.stock !== undefined && Number(payload.stock) <= 0) {
    payload.stock = 0;
  }

  const product = await Product.create(payload);
  res.status(201).json(product);
};

export const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const payload = { ...req.body };

  if (payload.category !== undefined) {
    payload.category = normalizeCategory(payload.category);
  }

  if (payload.name && !payload.slug) {
    payload.slug = await makeUniqueSlug(payload.name, product._id.toString());
  }

  if (payload.slug) {
    payload.slug = await makeUniqueSlug(payload.slug, product._id.toString());
  }

  if (payload.stock !== undefined && Number(payload.stock) <= 0) {
    payload.stock = 0;
  }

  Object.assign(product, payload);
  const updated = await product.save();
  res.json(updated);
};

export const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  await product.deleteOne();
  res.json({ message: "Product deleted" });
};
