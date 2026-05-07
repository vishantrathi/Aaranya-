import { create } from 'zustand';

import api from '../../api/axios';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'in-stock' | 'out-of-stock';
  description: string;
  image: string;
  lastUpdated: string;
}

export interface Order {
  id: string;
  customer: string;
  product: string;
  amount: number;
  status: 'Pending' | 'Confirmed' | 'Delivered' | 'Undelivered' | 'Failed';
  date: string;
}

interface AdminStore {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;

  products: Product[];
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id' | 'lastUpdated'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  toggleStock: (id: string) => Promise<void>;

  orders: Order[];
  fetchOrders: () => Promise<void>;
  updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;
}

const categoryToUi: Record<string, string> = {
  fruits: 'Mangoes',
  vegetables: 'Vegetables',
  grains: 'Wheat Grain',
  organic: 'Seasonal',
  'non-organic': 'Seasonal',
};

const categoryToApi: Record<string, string> = {
  Mangoes: 'fruits',
  Vegetables: 'vegetables',
  'Wheat Grain': 'grains',
  'Wheat Atta': 'grains',
  'Rice Grain': 'grains',
  'Rice Atta': 'grains',
  Seasonal: 'organic',
};

const getStoredAuth = () => {
  const raw = localStorage.getItem('pcf_auth');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const toProduct = (product: any): Product => ({
  id: product._id,
  name: product.name,
  category: categoryToUi[product.category] || 'Seasonal',
  price: Number(product.price) || 0,
  stock: Number(product.stock) || 0,
  status: Number(product.stock) > 0 ? 'in-stock' : 'out-of-stock',
  description: product.description || '',
  image: product.image || '',
  lastUpdated: String(product.updatedAt || product.createdAt || '').slice(0, 10),
});

const toOrder = (order: any): Order => ({
  id: order._id,
  customer: order.user?.name || 'Guest Checkout',
  product: order.items?.map((item: any) => item.name).join(', ') || 'Order Items',
  amount: Number(order.totalAmount) || 0,
  status: (order.orderStatus || 'Pending') as Order['status'],
  date: String(order.createdAt || '').slice(0, 10),
});

export const useAdminStore = create<AdminStore>((set, get) => ({
  isAuthenticated: Boolean(getStoredAuth()?.token && getStoredAuth()?.role === 'admin'),

  login: async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      if (data?.role !== 'admin') {
        return false;
      }

      localStorage.setItem('pcf_auth', JSON.stringify(data));
      set({ isAuthenticated: true });
      await Promise.all([get().fetchProducts(), get().fetchOrders()]);
      return true;
    } catch {
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('pcf_auth');
    set({ isAuthenticated: false, products: [], orders: [] });
  },

  products: [],

  fetchProducts: async () => {
    const { data } = await api.get('/products?includeOutOfStock=true');
    set({ products: (Array.isArray(data) ? data : []).map(toProduct) });
  },

  addProduct: async (product) => {
    const payload = {
      name: product.name,
      description: product.description,
      image: product.image,
      price: Number(product.price),
      stock: Number(product.stock),
      category: categoryToApi[product.category] || 'organic',
      unit: 'kg',
      isActive: true,
      tags: [product.category],
    };

    await api.post('/products', payload);
    await get().fetchProducts();
  },

  updateProduct: async (id, updates) => {
    const payload: Record<string, any> = {
      ...updates,
      price: updates.price !== undefined ? Number(updates.price) : undefined,
      stock: updates.stock !== undefined ? Number(updates.stock) : undefined,
    };

    if (updates.category) {
      payload.category = categoryToApi[updates.category] || 'organic';
    }

    if (updates.status) {
      payload.stock = updates.status === 'out-of-stock' ? 0 : Number(updates.stock ?? 1);
    }

    Object.keys(payload).forEach((key) => payload[key] === undefined && delete payload[key]);

    await api.put(`/products/${id}`, payload);
    await get().fetchProducts();
  },

  deleteProduct: async (id) => {
    await api.delete(`/products/${id}`);
    set((state) => ({ products: state.products.filter((product) => product.id !== id) }));
  },

  toggleStock: async (id) => {
    const product = get().products.find((item) => item.id === id);
    if (!product) return;

    const nextStatus = product.status === 'in-stock' ? 'out-of-stock' : 'in-stock';
    const nextStock = nextStatus === 'out-of-stock' ? 0 : product.stock > 0 ? product.stock : 1;

    await api.put(`/products/${id}`, { stock: nextStock });
    await get().fetchProducts();
  },

  orders: [],

  fetchOrders: async () => {
    const { data } = await api.get('/orders');
    set({ orders: (Array.isArray(data) ? data : []).map(toOrder) });
  },

  updateOrderStatus: async (id, status) => {
    await api.put(`/orders/${id}/status`, { orderStatus: status });
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === id ? { ...order, status } : order
      ),
    }));
  },
}));
