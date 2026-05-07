import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Pencil, Trash2, X, Upload, AlertTriangle, CheckCircle2,
  Filter, ChevronLeft, ChevronRight, Package,
} from 'lucide-react';
import { useAdminStore, Product } from '../store/adminStore';

const CATEGORIES = ['Mangoes', 'Vegetables', 'Wheat Grain', 'Wheat Atta', 'Rice Grain', 'Rice Atta', 'Seasonal'];
const PAGE_SIZE = 10;

function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20 }}
      className={`fixed top-6 right-6 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border text-sm font-medium ${
        type === 'success'
          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
          : 'bg-red-50 border-red-200 text-red-800'
      }`}
    >
      {type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-red-500" />}
      {message}
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100"><X className="w-3.5 h-3.5" /></button>
    </motion.div>
  );
}

type FormData = {
  name: string;
  category: string;
  description: string;
  price: string;
  stock: string;
  status: 'in-stock' | 'out-of-stock';
  image: string;
  inSeason: boolean;
};

const emptyForm: FormData = {
  name: '', category: 'Mangoes', description: '', price: '', stock: '',
  status: 'in-stock', image: '', inSeason: false,
};

function ProductModal({
  mode,
  product,
  onClose,
  onSave,
}: {
  mode: 'add' | 'edit';
  product?: Product;
  onClose: () => void;
  onSave: (data: FormData) => void;
}) {
  const [form, setForm] = useState<FormData>(
    product
      ? { name: product.name, category: product.category, description: product.description,
          price: String(product.price), stock: String(product.stock), status: product.status,
          image: product.image, inSeason: false }
      : emptyForm
  );
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      if (result) {
        set('image', result);
      }
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const e: Partial<FormData> = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) e.price = 'Enter valid price';
    if (!form.stock || isNaN(Number(form.stock)) || Number(form.stock) < 0) e.stock = 'Enter valid stock';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSave(form);
  };

  const set = (field: keyof FormData, value: string | boolean) =>
    setForm((f) => ({ ...f, [field]: value }));

  const previewImages = [
    'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=200&q=80',
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-primary-50 to-white">
          <h2 className="text-lg font-extrabold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
            {mode === 'add' ? '✦ Add New Product' : '✦ Edit Product'}
          </h2>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[75vh]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Product Name *</label>
              <input
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="e.g. Alphonso Mangoes"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${errors.name ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-primary-400 focus:bg-primary-50/30'}`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Category *</label>
              <select
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary-400 bg-white"
              >
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Status *</label>
              <select
                value={form.status}
                onChange={(e) => set('status', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary-400 bg-white"
              >
                <option value="in-stock">In Stock</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Price per kg (₹) *</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => set('price', e.target.value)}
                placeholder="149"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${errors.price ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-primary-400'}`}
              />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
            </div>

            {/* Stock */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Stock Quantity (kg) *</label>
              <input
                type="number"
                value={form.stock}
                onChange={(e) => set('stock', e.target.value)}
                placeholder="100"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${errors.stock ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-primary-400'}`}
              />
              {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                rows={3}
                placeholder="Describe the product quality, origin, etc."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary-400 resize-none"
              />
            </div>

            {/* Image URL */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Image URL</label>
              <input
                value={form.image}
                onChange={(e) => set('image', e.target.value)}
                placeholder="https://... (or leave blank to use placeholder)"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary-400"
              />
            </div>

            {/* Preview images */}
            <div className="sm:col-span-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Quick Select Image</p>
              <div className="flex gap-3">
                {previewImages.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => set('image', img)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${form.image === img ? 'border-primary-500 ring-2 ring-primary-200' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    {form.image === img && (
                      <div className="absolute inset-0 bg-primary-500/20 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-primary-700" />
                      </div>
                    )}
                  </button>
                ))}
                <label className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-300 hover:border-primary-400 flex flex-col items-center justify-center gap-1 cursor-pointer text-gray-400 hover:text-primary-500 transition-colors">
                  <Upload className="w-4 h-4" />
                  <span className="text-xs">Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            </div>

            {/* In Season checkbox */}
            <div className="sm:col-span-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div
                  onClick={() => set('inSeason', !form.inSeason)}
                  className={`w-10 h-5 rounded-full transition-colors relative ${form.inSeason ? 'bg-primary-600' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${form.inSeason ? 'left-5' : 'left-0.5'}`} />
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Mark as In Season</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 text-white text-sm font-bold hover:from-primary-700 hover:to-primary-800 shadow-sm transition-all hover:shadow-md">
              {mode === 'add' ? 'Save Product' : 'Update Product'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function DeleteModal({ product, onClose, onConfirm }: { product: Product; onClose: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 text-center"
      >
        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-6 h-6 text-red-500" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Product?</h3>
        <p className="text-sm text-gray-500 mb-6">
          Are you sure you want to delete <span className="font-semibold text-gray-800">{product.name}</span>? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-colors">
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function Products() {
  const { products, fetchProducts, addProduct, updateProduct, deleteProduct, toggleStock } = useAdminStore();
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [stockFilter, setStockFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<'add' | 'edit' | 'delete' | null>(null);
  const [selected, setSelected] = useState<Product | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [sortBy, setSortBy] = useState<keyof Product>('lastUpdated');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchProducts().catch(() => {
      showToast('Failed to load products.', 'error');
    });
  }, [fetchProducts]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const filtered = useMemo(() => {
    let list = [...products];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    if (catFilter !== 'All') list = list.filter((p) => p.category === catFilter);
    if (stockFilter !== 'All') list = list.filter((p) => p.status === (stockFilter === 'In Stock' ? 'in-stock' : 'out-of-stock'));
    list.sort((a, b) => {
      const va = String(a[sortBy]), vb = String(b[sortBy]);
      return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
    });
    return list;
  }, [products, search, catFilter, stockFilter, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (col: keyof Product) => {
    if (sortBy === col) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortBy(col); setSortDir('asc'); }
  };

  const handleAdd = async (form: FormData) => {
    try {
      await addProduct({
        name: form.name, category: form.category, description: form.description,
        price: Number(form.price), stock: Number(form.stock), status: form.status,
        image: form.image || 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=400&q=80',
      });
      setModal(null);
      showToast('Product added successfully!');
    } catch {
      showToast('Failed to add product.', 'error');
    }
  };

  const handleEdit = async (form: FormData) => {
    if (!selected) return;
    try {
      await updateProduct(selected.id, {
        name: form.name, category: form.category, description: form.description,
        price: Number(form.price), stock: Number(form.stock), status: form.status,
        image: form.image || selected.image,
      });
      setModal(null);
      setSelected(null);
      showToast('Product updated successfully!');
    } catch {
      showToast('Failed to update product.', 'error');
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    try {
      await deleteProduct(selected.id);
      setModal(null);
      setSelected(null);
      showToast('Product deleted.', 'success');
    } catch {
      showToast('Failed to delete product.', 'error');
    }
  };

  const SortIcon = ({ col }: { col: keyof Product }) => (
    <span className={`ml-1 text-xs ${sortBy === col ? 'text-primary-600' : 'text-gray-300'}`}>
      {sortBy === col ? (sortDir === 'asc' ? '▲' : '▼') : '⇅'}
    </span>
  );

  return (
    <div>
      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {modal === 'add' && <ProductModal mode="add" onClose={() => setModal(null)} onSave={handleAdd} />}
        {modal === 'edit' && selected && <ProductModal mode="edit" product={selected} onClose={() => { setModal(null); setSelected(null); }} onSave={handleEdit} />}
        {modal === 'delete' && selected && <DeleteModal product={selected} onClose={() => { setModal(null); setSelected(null); }} onConfirm={handleDelete} />}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
            All Products
          </h1>
          <p className="text-gray-500 text-sm mt-1">{products.length} products in inventory</p>
        </div>
        <button
          onClick={() => setModal('add')}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold text-sm rounded-xl shadow hover:from-primary-700 hover:to-primary-800 transition-all hover:shadow-md"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name or category…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary-400 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <select
            value={catFilter}
            onChange={(e) => { setCatFilter(e.target.value); setPage(1); }}
            className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary-400 bg-white"
          >
            <option>All</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select
            value={stockFilter}
            onChange={(e) => { setStockFilter(e.target.value); setPage(1); }}
            className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary-400 bg-white"
          >
            <option>All</option>
            <option>In Stock</option>
            <option>Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {[
                  { label: 'Product', col: 'name' as keyof Product },
                  { label: 'Category', col: 'category' as keyof Product },
                  { label: 'Price/kg', col: 'price' as keyof Product },
                  { label: 'Stock (kg)', col: 'stock' as keyof Product },
                  { label: 'Status', col: 'status' as keyof Product },
                  { label: 'Updated', col: 'lastUpdated' as keyof Product },
                ].map(({ label, col }) => (
                  <th
                    key={col}
                    onClick={() => handleSort(col)}
                    className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wide cursor-pointer hover:text-gray-800 whitespace-nowrap select-none"
                  >
                    {label} <SortIcon col={col} />
                  </th>
                ))}
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence>
                {pageData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16 text-gray-400">
                      <Package className="w-10 h-10 mx-auto mb-3 opacity-40" />
                      <p className="font-medium">No products found</p>
                    </td>
                  </tr>
                ) : (
                  pageData.map((product) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-primary-50/30 transition-colors"
                    >
                      {/* Product */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-10 h-10 rounded-xl object-cover flex-shrink-0 border border-gray-100"
                          />
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 truncate max-w-[180px]">{product.name}</p>
                            <p className="text-xs text-gray-400 truncate max-w-[180px]">{(product.description?.slice(0, 40) ?? '')}…</p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-3.5">
                        <span className="bg-primary-50 text-primary-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                          {product.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-5 py-3.5 font-bold text-gray-900">₹{product.price}</td>

                      {/* Stock */}
                      <td className="px-5 py-3.5">
                        <span className={`font-semibold ${product.stock <= 5 ? 'text-amber-600' : 'text-gray-800'}`}>
                          {product.stock}
                          {product.stock <= 5 && product.stock > 0 && (
                            <span className="ml-1 text-xs font-normal text-amber-500">⚠ Low</span>
                          )}
                        </span>
                      </td>

                      {/* Status toggle */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <button
                            onClick={() => {
                              toggleStock(product.id);
                              showToast(
                                product.status === 'in-stock'
                                  ? `${product.name} marked out of stock`
                                  : `${product.name} marked in stock`
                              );
                            }}
                            className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${
                              product.status === 'in-stock' ? 'bg-emerald-500' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${
                                product.status === 'in-stock' ? 'left-5' : 'left-0.5'
                              }`}
                            />
                          </button>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            product.status === 'in-stock'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-red-100 text-red-600'
                          }`}>
                            {product.status === 'in-stock' ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </div>
                      </td>

                      {/* Updated */}
                      <td className="px-5 py-3.5 text-xs text-gray-400 whitespace-nowrap">{product.lastUpdated}</td>

                      {/* Actions */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => { setSelected(product); setModal('edit'); }}
                            className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => { setSelected(product); setModal('delete'); }}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-3.5 border-t border-gray-100 bg-gray-50/50">
            <p className="text-xs text-gray-500">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} products
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                    n === page
                      ? 'bg-primary-600 text-white shadow'
                      : 'border border-gray-200 text-gray-600 hover:bg-white'
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
