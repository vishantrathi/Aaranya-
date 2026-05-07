import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, CheckCircle, XCircle, TrendingUp, AlertTriangle, Clock, ArrowRight } from 'lucide-react';
import { useAdminStore } from '../store/adminStore';
import { useNavigate } from 'react-router-dom';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }),
};

type RevenueFilter = 'month' | 'last-month' | 'year' | 'all';

const getDateRange = (filter: RevenueFilter): { start: Date; end: Date } => {
  const now = new Date();
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  switch (filter) {
    case 'month':
      return {
        start: new Date(now.getFullYear(), now.getMonth(), 1),
        end,
      };
    case 'last-month': {
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
      return {
        start: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1),
        end: new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0),
      };
    }
    case 'year':
      return {
        start: new Date(now.getFullYear(), 0, 1),
        end: new Date(now.getFullYear(), 11, 31),
      };
    default:
      return {
        start: new Date(2000, 0, 1),
        end: new Date(2100, 11, 31),
      };
  }
};

export default function Dashboard() {
  const navigate = useNavigate();
  const products = useAdminStore((s) => s.products);
  const orders = useAdminStore((s) => s.orders);
  const fetchProducts = useAdminStore((s) => s.fetchProducts);
  const fetchOrders = useAdminStore((s) => s.fetchOrders);
  const [revenueFilter, setRevenueFilter] = useState<RevenueFilter>('month');

  useEffect(() => {
    fetchProducts().catch(() => undefined);
    fetchOrders().catch(() => undefined);
  }, [fetchProducts, fetchOrders]);

  const total = products.length;
  const inStock = products.filter((p) => p.status === 'in-stock').length;
  const outOfStock = products.filter((p) => p.status === 'out-of-stock').length;
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 5);
  const recentProducts = [...products].sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated)).slice(0, 5);

  const revenue = useMemo(() => {
    const { start, end } = getDateRange(revenueFilter);
    const filteredTotal = orders
      .filter((order) => {
        const orderDate = new Date(order.date);
        return orderDate >= start && orderDate <= end && order.status !== 'Failed';
      })
      .reduce((sum, order) => sum + order.amount, 0);

    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(filteredTotal);
  }, [orders, revenueFilter]);

  const revenueLabel = useMemo(() => {
    const labels: Record<RevenueFilter, string> = {
      month: 'Revenue (This Month)',
      'last-month': 'Revenue (Last Month)',
      year: 'Revenue (This Year)',
      all: 'Total Revenue',
    };
    return labels[revenueFilter];
  }, [revenueFilter]);

  const statCards = [
    {
      label: 'Total Products',
      value: total,
      icon: Package,
      color: 'from-primary-600 to-primary-800',
      iconBg: 'bg-primary-100 text-primary-700',
    },
    {
      label: 'In Stock',
      value: inStock,
      icon: CheckCircle,
      color: 'from-emerald-500 to-emerald-700',
      iconBg: 'bg-emerald-100 text-emerald-700',
    },
    {
      label: 'Out of Stock',
      value: outOfStock,
      icon: XCircle,
      color: 'from-red-500 to-red-700',
      iconBg: 'bg-red-100 text-red-600',
    },
    {
      label: revenueLabel,
      value: revenue,
      icon: TrendingUp,
      color: 'from-amber-500 to-amber-700',
      iconBg: 'bg-amber-100 text-amber-700',
    },
  ];

  const statusColor: Record<string, string> = {
    Delivered: 'bg-emerald-100 text-emerald-700',
    Confirmed: 'bg-blue-100 text-blue-700',
    Pending: 'bg-amber-100 text-amber-700',
    Undelivered: 'bg-orange-100 text-orange-700',
    Failed: 'bg-red-100 text-red-700',
  };

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
            Dashboard
          </h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back, AARANYA team 🌾</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {[
            { label: 'This Month', value: 'month' as const },
            { label: 'Last Month', value: 'last-month' as const },
            { label: 'This Year', value: 'year' as const },
            { label: 'All Time', value: 'all' as const },
          ].map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setRevenueFilter(value)}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                revenueFilter === value
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div className={`w-12 h-12 rounded-xl ${card.iconBg} flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-gray-900">{card.value}</p>
                <p className="text-sm text-gray-500">{card.label}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Products */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-800">Recent Products</h2>
            <button
              onClick={() => navigate('/admin/products')}
              className="text-primary-600 text-sm font-medium flex items-center gap-1 hover:text-primary-800 transition-colors"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {recentProducts.map((p) => (
              <div key={p.id} className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 transition-colors">
                <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.category}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-gray-800">₹{p.price}/kg</p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    p.status === 'in-stock' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'
                  }`}>
                    {p.status === 'in-stock' ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Side panels */}
        <div className="space-y-5">
          {/* Low Stock Alert */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
          >
            <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h2 className="font-bold text-gray-800 text-sm">Low Stock Alerts</h2>
            </div>
            {lowStock.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-6">All products are well-stocked ✅</p>
            ) : (
              <div className="divide-y divide-gray-50">
                {lowStock.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 px-6 py-3">
                    <img src={p.image} alt={p.name} className="w-8 h-8 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-700 truncate">{p.name}</p>
                      <p className="text-xs text-amber-600 font-medium">Only {p.stock}kg left</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
          >
            <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
              <Clock className="w-4 h-4 text-primary-600" />
              <h2 className="font-bold text-gray-800 text-sm">Recent Orders</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {orders.slice(0, 4).map((o) => (
                <div key={o.id} className="flex items-center gap-3 px-6 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-700 truncate">{o.customer}</p>
                    <p className="text-xs text-gray-400 truncate">{o.product}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-800">₹{o.amount}</p>
                    <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${statusColor[o.status]}`}>
                      {o.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
