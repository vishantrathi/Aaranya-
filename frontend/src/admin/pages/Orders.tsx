import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAdminStore } from '../store/adminStore';

const statusColor: Record<string, string> = {
  Delivered: 'bg-emerald-100 text-emerald-700',
  Confirmed: 'bg-blue-100 text-blue-700',
  Pending: 'bg-amber-100 text-amber-700',
  Undelivered: 'bg-orange-100 text-orange-700',
  Failed: 'bg-red-100 text-red-700',
};

const allowedStatuses = ['Pending', 'Delivered', 'Undelivered', 'Failed'] as const;

export default function Orders() {
  const orders = useAdminStore((s) => s.orders);
  const fetchOrders = useAdminStore((s) => s.fetchOrders);
  const updateOrderStatus = useAdminStore((s) => s.updateOrderStatus);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders().catch(() => undefined);
  }, [fetchOrders]);

  const handleStatusChange = async (id: string, status: (typeof allowedStatuses)[number]) => {
    try {
      setUpdatingId(id);
      await updateOrderStatus(id, status);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
          Orders
        </h1>
        <p className="text-gray-500 text-sm mt-1">{orders.length} orders total</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Order ID', 'Customer', 'Product', 'Amount', 'Status', 'Date'].map((h) => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs font-bold text-primary-700">{order.id}</td>
                  <td className="px-5 py-3.5 font-medium text-gray-800">{order.customer}</td>
                  <td className="px-5 py-3.5 text-gray-600 max-w-[180px] truncate">{order.product}</td>
                  <td className="px-5 py-3.5 font-bold text-gray-900">₹{order.amount}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor[order.status]}`}>
                        {order.status}
                      </span>
                      <select
                        value={order.status}
                        onChange={(event) => void handleStatusChange(order.id, event.target.value as (typeof allowedStatuses)[number])}
                        disabled={updatingId === order.id}
                        className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 outline-none focus:border-primary-500 disabled:opacity-60"
                      >
                        {allowedStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-gray-400">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
