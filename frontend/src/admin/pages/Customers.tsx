import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Users, Wallet, CheckCircle2, XCircle, Download, ChevronLeft, ChevronRight } from 'lucide-react';

import api from '../../api/axios';

type CustomerMetric = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  successfulOrders: number;
  unsuccessfulOrders: number;
  totalRevenue: number;
  createdAt: string;
};

type DateRange = 'all' | 'today' | 'week' | 'month';

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat('en-IN');

const getDateRange = (range: DateRange): { startDate?: string; endDate?: string } => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (range) {
    case 'today':
      return {
        startDate: today.toISOString(),
        endDate: new Date(today.getTime() + 86400000).toISOString(),
      };
    case 'week': {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      return {
        startDate: startOfWeek.toISOString(),
        endDate: new Date(today.getTime() + 86400000).toISOString(),
      };
    }
    case 'month': {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      return {
        startDate: startOfMonth.toISOString(),
        endDate: new Date(today.getTime() + 86400000).toISOString(),
      };
    }
    default:
      return {};
  }
};

export default function Customers() {
  const [customers, setCustomers] = useState<CustomerMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [dateRange, setDateRange] = useState<DateRange>('all');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        setError('');
        setCurrentPage(1);
        
        const params = getDateRange(dateRange);
        const { data } = await api.get('/admin/customers', { params });
        setCustomers(Array.isArray(data) ? data : []);
      } catch (fetchError: any) {
        const message = fetchError?.response?.data?.message || 'Failed to load customer data';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers().catch(() => undefined);
  }, [dateRange]);

  const filteredCustomers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return customers;

    return customers.filter((customer) => {
      return (
        customer.name.toLowerCase().includes(term) ||
        customer.phone.toLowerCase().includes(term) ||
        customer.email.toLowerCase().includes(term)
      );
    });
  }, [customers, search]);

  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCustomers.slice(start, start + pageSize);
  }, [filteredCustomers, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredCustomers.length / pageSize);

  const totals = useMemo(() => {
    return filteredCustomers.reduce(
      (acc, customer) => {
        acc.customers += 1;
        acc.totalOrders += customer.totalOrders;
        acc.successfulOrders += customer.successfulOrders;
        acc.unsuccessfulOrders += customer.unsuccessfulOrders;
        acc.totalRevenue += customer.totalRevenue;
        return acc;
      },
      {
        customers: 0,
        totalOrders: 0,
        successfulOrders: 0,
        unsuccessfulOrders: 0,
        totalRevenue: 0,
      }
    );
  }, [filteredCustomers]);

  const exportToCSV = () => {
    const headers = [
      'Customer Name',
      'Phone',
      'Email',
      'Total Orders',
      'Successful Orders',
      'Unsuccessful Orders',
      'Total Revenue',
      'Registered Date',
    ];

    const rows = filteredCustomers.map((customer) => [
      customer.name,
      customer.phone,
      customer.email,
      customer.totalOrders,
      customer.successfulOrders,
      customer.unsuccessfulOrders,
      customer.totalRevenue,
      new Date(customer.createdAt).toLocaleDateString('en-IN'),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${String(cell || '').replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `customers-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
            Customers
          </h1>
          <p className="text-gray-500 text-sm mt-1">Registered customer analytics and order outcomes</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by name, number, or email"
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500 flex-1 min-w-[200px]"
          />
          <button
            onClick={exportToCSV}
            disabled={filteredCustomers.length === 0}
            className="rounded-xl bg-primary-600 text-white px-4 py-2 text-sm font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Date Range Filters */}
      <div className="mb-6 flex gap-2 flex-wrap">
        {[
          { label: 'All Time', value: 'all' as const },
          { label: 'Today', value: 'today' as const },
          { label: 'This Week', value: 'week' as const },
          { label: 'This Month', value: 'month' as const },
        ].map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setDateRange(value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              dateRange === value
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-6">
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">Total Customers</p>
          <p className="mt-1 text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <Users className="h-5 w-5 text-primary-600" />
            {numberFormatter.format(totals.customers)}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">Total Orders</p>
          <p className="mt-1 text-2xl font-extrabold text-gray-900">{numberFormatter.format(totals.totalOrders)}</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">Successful Orders</p>
          <p className="mt-1 text-2xl font-extrabold text-emerald-700 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            {numberFormatter.format(totals.successfulOrders)}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">Unsuccessful Orders</p>
          <p className="mt-1 text-2xl font-extrabold text-red-700 flex items-center gap-2">
            <XCircle className="h-5 w-5" />
            {numberFormatter.format(totals.unsuccessfulOrders)}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">Revenue from Customers</p>
          <p className="mt-1 text-xl font-extrabold text-gray-900 flex items-center gap-2">
            <Wallet className="h-5 w-5 text-amber-600" />
            {currencyFormatter.format(totals.totalRevenue)}
          </p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading customer analytics...
          </div>
        ) : error ? (
          <div className="py-16 text-center text-sm text-red-600">{error}</div>
        ) : filteredCustomers.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-500">No customers found.</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {[
                      'Customer Name',
                      'Number',
                      'Email',
                      'Total Orders',
                      'Successful',
                      'Unsuccessful',
                      'Revenue',
                    ].map((header) => (
                      <th
                        key={header}
                        className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginatedCustomers.map((customer) => (
                    <tr key={customer._id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-5 py-3.5 font-semibold text-gray-800 whitespace-nowrap">{customer.name}</td>
                      <td className="px-5 py-3.5 text-gray-700 whitespace-nowrap">{customer.phone || '-'}</td>
                      <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">{customer.email || '-'}</td>
                      <td className="px-5 py-3.5 font-semibold text-gray-900">{numberFormatter.format(customer.totalOrders)}</td>
                      <td className="px-5 py-3.5 font-semibold text-emerald-700">{numberFormatter.format(customer.successfulOrders)}</td>
                      <td className="px-5 py-3.5 font-semibold text-red-700">{numberFormatter.format(customer.unsuccessfulOrders)}</td>
                      <td className="px-5 py-3.5 font-bold text-gray-900">{currencyFormatter.format(customer.totalRevenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="flex items-center justify-between gap-4 px-6 py-4 border-t border-gray-100 bg-gray-50 flex-wrap">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600 font-medium">Show:</label>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-1 text-sm outline-none focus:border-primary-500"
                >
                  {[5, 10, 25, 50].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                <span className="text-sm text-gray-600">per page</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages || 1} • {filteredCustomers.length} total
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
