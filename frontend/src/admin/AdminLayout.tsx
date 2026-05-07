import { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  Megaphone,
  BookOpen,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ChevronRight,
  Sun,
  Moon,
} from 'lucide-react';
import { useAdminStore } from './store/adminStore';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
  { label: 'Products', icon: Package, path: '/admin/products' },
  { label: 'Orders', icon: ShoppingCart, path: '/admin/orders' },
  { label: 'Customers', icon: Users, path: '/admin/customers' },
  { label: 'Categories', icon: Tag, path: '/admin/categories' },
  { label: 'Offers', icon: Megaphone, path: '/admin/offers' },
  { label: 'Blogs', icon: BookOpen, path: '/admin/blogs' },
  { label: 'Settings', icon: Settings, path: '/admin/settings' },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAdminStore((s) => s.logout);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [search, setSearch] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const SidebarContent = ({ onNav }: { onNav?: () => void }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-primary-800/30">
        <img
          src="/image.png"
          alt="AARANYA logo"
          className="h-9 w-9 rounded-xl border border-amber-300/40 object-cover shadow-lg"
        />
        <div className="min-w-0">
          <p className="font-extrabold text-white text-sm leading-tight">AARANYA</p>
          <p className="text-primary-300 text-xs">Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ label, icon: Icon, path }) => (
          <NavLink
            key={path}
            to={path}
            onClick={onNav}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-white/15 text-white shadow-sm border border-white/10'
                  : 'text-primary-200 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-amber-400' : ''}`} />
                <span>{label}</span>
                {isActive && <ChevronRight className="w-3 h-3 ml-auto text-amber-400" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-6 border-t border-primary-800/30 pt-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen flex ${darkMode ? 'dark bg-gray-950' : 'bg-gray-50'}`}>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-gradient-to-b from-primary-900 to-primary-950 shadow-2xl flex-shrink-0 fixed h-full z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 h-full w-72 bg-gradient-to-b from-primary-900 to-primary-950 shadow-2xl z-50"
            >
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 text-white/70 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
              <SidebarContent onNav={() => setSidebarOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        {/* Top bar */}
        <header className={`sticky top-0 z-20 flex items-center gap-4 px-6 py-3.5 border-b shadow-sm ${
          darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
        }`}>
          <button
            className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search */}
          <div className={`flex-1 max-w-md relative ${darkMode ? 'text-gray-200' : ''}`}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products, orders…"
              className={`w-full pl-9 pr-4 py-2 text-sm rounded-xl border outline-none transition-all ${
                darkMode
                  ? 'bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500 focus:border-primary-500'
                  : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-primary-400 focus:bg-white'
              }`}
            />
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {/* Dark mode */}
            <button
              onClick={() => setDarkMode((d) => !d)}
              className={`p-2 rounded-lg transition-colors ${darkMode ? 'text-amber-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notifications */}
            <button className={`relative p-2 rounded-lg transition-colors ${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}>
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* Avatar */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center shadow">
                <span className="text-white text-xs font-bold">PC</span>
              </div>
              <div className="hidden sm:block">
                <p className={`text-sm font-semibold leading-tight ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>AARANYA</p>
                <p className="text-xs text-gray-400">Super Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className={`flex-1 p-6 ${darkMode ? 'text-gray-100' : ''}`}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
