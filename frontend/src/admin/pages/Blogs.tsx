import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Plus, Trash2, Pencil, X, Upload } from 'lucide-react';

import api from '../../api/axios';

type BlogItem = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  isActive: boolean;
  publishedAt: string | null;
  createdAt: string;
};

type FormState = {
  title: string;
  excerpt: string;
  content: string;
  image: string;
  isActive: boolean;
  publishedAt: string;
};

const emptyForm: FormState = {
  title: '',
  excerpt: '',
  content: '',
  image: '',
  isActive: true,
  publishedAt: '',
};

const toLocalDateTimeInput = (value?: string | null) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const offsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
};

export default function Blogs() {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogItem | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  const sortedBlogs = useMemo(() => blogs, [blogs]);

  const loadBlogs = async () => {
    try {
      setIsLoading(true);
      setError('');
      const { data } = await api.get('/blogs/admin');
      setBlogs(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load blogs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadBlogs();
  }, []);

  const openCreate = () => {
    setEditingBlog(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEdit = (blog: BlogItem) => {
    setEditingBlog(blog);
    setForm({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      image: blog.image,
      isActive: Boolean(blog.isActive),
      publishedAt: toLocalDateTimeInput(blog.publishedAt),
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      if (result) {
        setForm((prev) => ({ ...prev, image: result }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.title.trim() || !form.excerpt.trim() || !form.content.trim() || !form.image.trim()) {
      setError('Title, excerpt, content, and image are required');
      return;
    }

    const payload = {
      title: form.title.trim(),
      excerpt: form.excerpt.trim(),
      content: form.content.trim(),
      image: form.image.trim(),
      isActive: form.isActive,
      publishedAt: form.publishedAt ? new Date(form.publishedAt).toISOString() : null,
    };

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      if (editingBlog) {
        await api.put(`/blogs/admin/${editingBlog._id}`, payload);
        setSuccess('Blog updated successfully.');
      } else {
        await api.post('/blogs/admin', payload);
        setSuccess('Blog created successfully.');
      }

      setIsModalOpen(false);
      setEditingBlog(null);
      setForm(emptyForm);
      await loadBlogs();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save blog');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (blogId: string) => {
    const approved = window.confirm('Delete this blog post?');
    if (!approved) return;

    try {
      await api.delete(`/blogs/admin/${blogId}`);
      setSuccess('Blog deleted successfully.');
      await loadBlogs();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to delete blog');
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
            Blog Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">Create, edit, and remove blog posts with top images from one place.</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-primary-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-800"
        >
          <Plus className="h-4 w-4" />
          Create Blog
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </div>
      )}

      {isLoading ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-500">Loading blog posts...</div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {sortedBlogs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-sm text-gray-500">
              No blog posts have been created yet.
            </div>
          ) : (
            sortedBlogs.map((blog) => (
              <motion.article
                key={blog._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
              >
                <img src={blog.image} alt={blog.title} className="h-48 w-full object-cover" />
                <div className="p-5">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-700">
                      <BookOpen className="h-3.5 w-3.5" />
                      Blog Post
                    </p>
                    <span className={`text-xs font-semibold ${blog.isActive ? 'text-emerald-700' : 'text-gray-500'}`}>
                      {blog.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">{blog.title}</h2>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-3">{blog.excerpt}</p>
                  <p className="mt-2 text-xs text-gray-400 line-clamp-2">{blog.content}</p>
                  <div className="mt-4 flex items-center justify-between gap-2">
                    <p className="text-xs text-gray-500">Slug: {blog.slug}</p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(blog)}
                        className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50"
                        aria-label="Edit blog"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDelete(blog._id)}
                        className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50"
                        aria-label="Delete blog"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))
          )}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 p-4">
          <motion.form
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSave}
            className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <h3 className="text-lg font-semibold text-gray-900">{editingBlog ? 'Edit Blog' : 'Create Blog'}</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-lg p-1 text-gray-500 hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-4 p-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-600">Title</label>
                <input value={form.title} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm" />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-600">Excerpt</label>
                <textarea value={form.excerpt} onChange={(e) => setForm((s) => ({ ...s, excerpt: e.target.value }))} rows={3} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm" />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-600">Content</label>
                <textarea value={form.content} onChange={(e) => setForm((s) => ({ ...s, content: e.target.value }))} rows={5} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm" />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-600">Top Image URL</label>
                <input value={form.image} onChange={(e) => setForm((s) => ({ ...s, image: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm" />
                <label className="mt-2 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-gray-300 px-3 py-2 text-xs text-gray-600 hover:border-primary-400 hover:text-primary-700">
                  <Upload className="h-3.5 w-3.5" /> Upload Image
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>

              <div className="sm:col-span-2">
                <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((s) => ({ ...s, isActive: e.target.checked }))} />
                  Active
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-5 py-4">
              <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="rounded-xl bg-primary-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-800 disabled:opacity-60">
                {saving ? 'Saving...' : editingBlog ? 'Update Blog' : 'Create Blog'}
              </button>
            </div>
          </motion.form>
        </div>
      )}
    </div>
  );
}
