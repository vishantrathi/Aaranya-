import { Navigate, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import OurFarm from "./pages/OurFarm";
import Blog from "./pages/Blog";
import About from "./pages/About";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import OrdersPage from "./pages/OrdersPage";
import AppShell from "./components/AppShell";
import ProtectedRoute from "./components/ProtectedRoute";

// Admin
import AdminLayout from "./admin/AdminLayout";
import AdminLogin from "./admin/pages/Login";
import Dashboard from "./admin/pages/Dashboard";
import Products from "./admin/pages/Products";
import Orders from "./admin/pages/Orders";
import Customers from "./admin/pages/Customers";
import Settings from "./admin/pages/Settings";
import Offers from "./admin/pages/Offers";
import Blogs from "./admin/pages/Blogs";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Customer site */}
      <Route element={<AppShell />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/our-farm" element={<OurFarm />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/about" element={<About />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
      </Route>

      {/* Admin login (no layout wrapper) */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Admin panel (protected) */}
      <Route
        path="/admin"
        element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="orders" element={<Orders />} />
        <Route path="customers" element={<Customers />} />
        <Route path="categories" element={<Dashboard />} />
        <Route path="offers" element={<Offers />} />
        <Route path="blogs" element={<Blogs />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
