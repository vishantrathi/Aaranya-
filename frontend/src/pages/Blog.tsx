import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import api from "../api/axios";

interface BlogPost {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  publishedAt?: string | null;
}

const Blog = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);

  useEffect(() => {
    let isMounted = true;

    const loadBlogs = async () => {
      try {
        const { data } = await api.get("/blogs");
        if (!isMounted) return;
        setBlogs(Array.isArray(data) ? data : []);
      } catch {
        if (!isMounted) return;
        setBlogs([]);
      }
    };

    void loadBlogs();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <p className="text-sm uppercase tracking-[0.16em] text-white">Blog</p>
        <h1 className="mt-2 text-4xl font-semibold text-white" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          Farm Journal
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-white/90">
          Stories from the fields, practical farming notes, and seasonal guidance from AARANYA.
        </p>
      </motion.div>

      <section className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog, index) => (
          <motion.article
            key={blog._id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className="overflow-hidden rounded-3xl border border-[#166534]/20 bg-white shadow-lg"
          >
            <img src={blog.image} alt={blog.title} className="h-44 w-full object-cover" />
            <div className="p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#C2410F]">Blog Post</p>
              <h2 className="mt-1 text-lg font-semibold text-[#2F1708]">{blog.title}</h2>
              <p className="mt-2 text-sm text-[#5A3D2A]">{blog.excerpt}</p>
              <p className="mt-3 text-sm text-[#5A3D2A]/85 line-clamp-4">{blog.content}</p>
            </div>
          </motion.article>
        ))}
      </section>

      {blogs.length === 0 && (
        <div className="rounded-3xl border border-dashed border-[#166534]/30 bg-white p-10 text-center text-sm text-[#451A03]/75">
          No blog posts available yet.
        </div>
      )}
    </main>
  );
};

export default Blog;
