import BlogPost from "../models/BlogPost.js";

const slugify = (value) =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const makeUniqueSlug = async (title, currentBlogId) => {
  const base = slugify(title) || `blog-${Date.now()}`;
  let candidate = base;
  let counter = 1;

  while (true) {
    const existing = await BlogPost.findOne({ slug: candidate });
    if (!existing || existing._id.toString() === currentBlogId) {
      return candidate;
    }

    candidate = `${base}-${counter}`;
    counter += 1;
  }
};

export const getPublicBlogs = async (_req, res) => {
  const blogs = await BlogPost.find({ isActive: true }).sort({ publishedAt: -1, createdAt: -1 });
  res.json(blogs);
};

export const getAdminBlogs = async (_req, res) => {
  const blogs = await BlogPost.find().sort({ createdAt: -1 });
  res.json(blogs);
};

export const createBlog = async (req, res) => {
  const payload = { ...req.body };

  if (!payload.title || !payload.excerpt || !payload.content || !payload.image) {
    res.status(400);
    throw new Error("title, excerpt, content and image are required");
  }

  payload.slug = await makeUniqueSlug(payload.slug || payload.title);
  payload.isActive = payload.isActive !== false;
  payload.publishedAt = payload.publishedAt ? new Date(payload.publishedAt) : new Date();

  const blog = await BlogPost.create(payload);
  res.status(201).json(blog);
};

export const updateBlog = async (req, res) => {
  const blog = await BlogPost.findById(req.params.id);

  if (!blog) {
    res.status(404);
    throw new Error("Blog post not found");
  }

  const payload = { ...req.body };

  if (payload.title && !payload.slug) {
    payload.slug = await makeUniqueSlug(payload.title, blog._id.toString());
  }

  if (payload.slug) {
    payload.slug = await makeUniqueSlug(payload.slug, blog._id.toString());
  }

  if (payload.publishedAt !== undefined) {
    payload.publishedAt = payload.publishedAt ? new Date(payload.publishedAt) : null;
  }

  Object.assign(blog, payload);
  const updated = await blog.save();
  res.json(updated);
};

export const deleteBlog = async (req, res) => {
  const blog = await BlogPost.findById(req.params.id);

  if (!blog) {
    res.status(404);
    throw new Error("Blog post not found");
  }

  await blog.deleteOne();
  res.json({ message: "Blog post deleted" });
};
