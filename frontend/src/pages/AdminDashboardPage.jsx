import { useEffect, useMemo, useState } from "react";

import api from "../api/axios";

const initialProductForm = {
  name: "",
  slug: "",
  description: "",
  image: "",
  price: "",
  unit: "kg",
  category: "vegetables",
  tags: "",
  stock: "",
  isFeaturedMango: false,
  isOrganic: false,
  isInSeason: false,
};

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [inventoryLogs, setInventoryLogs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [productForm, setProductForm] = useState(initialProductForm);
  const [editingProductId, setEditingProductId] = useState(null);

  const [inventoryForm, setInventoryForm] = useState({
    productId: "",
    delta: "",
    reason: "",
  });

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [statsRes, productsRes, ordersRes, usersRes, logsRes] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/products"),
        api.get("/orders"),
        api.get("/admin/users"),
        api.get("/inventory/logs"),
      ]);

      setStats(statsRes.data);
      setProducts(productsRes.data);
      setOrders(ordersRes.data);
      setUsers(usersRes.data);
      setInventoryLogs(logsRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load admin dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const lowStockList = useMemo(() => stats?.lowStockProducts || [], [stats]);

  const onProductFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetProductForm = () => {
    setProductForm(initialProductForm);
    setEditingProductId(null);
  };

  const startEditProduct = (product) => {
    setEditingProductId(product._id);
    setProductForm({
      name: product.name,
      slug: product.slug,
      description: product.description || "",
      image: product.image,
      price: String(product.price),
      unit: product.unit || "kg",
      category: product.category,
      tags: (product.tags || []).join(", "),
      stock: String(product.stock),
      isFeaturedMango: Boolean(product.isFeaturedMango),
      isOrganic: Boolean(product.isOrganic),
      isInSeason: Boolean(product.isInSeason),
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    const payload = {
      ...productForm,
      price: Number(productForm.price),
      stock: Number(productForm.stock),
      tags: productForm.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    try {
      if (editingProductId) {
        await api.put(`/products/${editingProductId}`, payload);
        setSuccess("Product updated successfully.");
      } else {
        await api.post("/products", payload);
        setSuccess("Product created successfully.");
      }

      resetProductForm();
      await loadDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save product");
    }
  };

  const handleDeleteProduct = async (productId) => {
    const approved = window.confirm("Delete this product?");
    if (!approved) return;

    try {
      setSuccess("");
      setError("");
      await api.delete(`/products/${productId}`);
      setSuccess("Product deleted.");
      await loadDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete product");
    }
  };

  const handleInventorySubmit = async (e) => {
    e.preventDefault();

    try {
      setSuccess("");
      setError("");
      await api.post("/inventory/adjust", {
        productId: inventoryForm.productId,
        delta: Number(inventoryForm.delta),
        reason: inventoryForm.reason,
      });
      setSuccess("Inventory updated.");
      setInventoryForm({ productId: "", delta: "", reason: "" });
      await loadDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to adjust inventory");
    }
  };

  const handleUpdateOrderStatus = async (orderId, nextStatus) => {
    try {
      setSuccess("");
      setError("");
      await api.put(`/orders/${orderId}/status`, { orderStatus: nextStatus });
      setSuccess("Order status updated.");
      await loadDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update order status");
    }
  };

  const handleUserRole = async (userId, role) => {
    try {
      setSuccess("");
      setError("");
      await api.put(`/admin/users/${userId}/role`, { role });
      setSuccess("User role updated.");
      await loadDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update user role");
    }
  };

  if (loading) {
    return (
      <section className="container section page-gap">
        <p>Loading admin dashboard...</p>
      </section>
    );
  }

  return (
    <section className="container section page-gap">
      <div className="section-heading">
        <h2>Admin Dashboard</h2>
        <p>Manage sales, products, users, inventory, and order flow.</p>
      </div>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <div className="admin-stats-grid">
        <article className="stat-card">
          <h4>Total Users</h4>
          <p>{stats?.totalUsers || 0}</p>
        </article>
        <article className="stat-card">
          <h4>Total Orders</h4>
          <p>{stats?.totalOrders || 0}</p>
        </article>
        <article className="stat-card">
          <h4>Total Products</h4>
          <p>{stats?.productCount || 0}</p>
        </article>
        <article className="stat-card">
          <h4>Total Sales</h4>
          <p>₹{(stats?.totalSales || 0).toFixed(2)}</p>
        </article>
      </div>

      <div className="admin-grid">
        <article className="admin-panel">
          <h3>{editingProductId ? "Edit Product" : "Add Product"}</h3>
          <form className="admin-form" onSubmit={handleProductSubmit}>
            <input name="name" placeholder="Product name" value={productForm.name} onChange={onProductFormChange} required />
            <input name="slug" placeholder="Slug" value={productForm.slug} onChange={onProductFormChange} required />
            <input name="image" placeholder="Image URL" value={productForm.image} onChange={onProductFormChange} required />
            <input
              name="price"
              type="number"
              min="0"
              step="0.01"
              placeholder="Price"
              value={productForm.price}
              onChange={onProductFormChange}
              required
            />
            <input name="unit" placeholder="Unit (kg/box/piece)" value={productForm.unit} onChange={onProductFormChange} required />
            <select name="category" value={productForm.category} onChange={onProductFormChange}>
              <option value="fruits">fruits</option>
              <option value="vegetables">vegetables</option>
              <option value="grains">grains</option>
              <option value="organic">organic</option>
              <option value="non-organic">non-organic</option>
            </select>
            <input
              name="stock"
              type="number"
              min="0"
              placeholder="Stock"
              value={productForm.stock}
              onChange={onProductFormChange}
              required
            />
            <input
              name="tags"
              placeholder="Tags (comma separated)"
              value={productForm.tags}
              onChange={onProductFormChange}
            />
            <textarea
              name="description"
              rows="3"
              placeholder="Description"
              value={productForm.description}
              onChange={onProductFormChange}
            />
            <label className="checkbox-field">
              <input
                name="isFeaturedMango"
                type="checkbox"
                checked={productForm.isFeaturedMango}
                onChange={onProductFormChange}
              />
              Highlight as seasonal mango
            </label>

            <label className="checkbox-field">
              <input
                name="isOrganic"
                type="checkbox"
                checked={productForm.isOrganic}
                onChange={onProductFormChange}
              />
              Show Organic badge
            </label>

            <label className="checkbox-field">
              <input
                name="isInSeason"
                type="checkbox"
                checked={productForm.isInSeason}
                onChange={onProductFormChange}
              />
              Show In Season badge
            </label>

            <div className="admin-form-actions">
              <button className="solid-btn" type="submit">
                {editingProductId ? "Update Product" : "Create Product"}
              </button>
              {editingProductId && (
                <button className="ghost-btn" type="button" onClick={resetProductForm}>
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </article>

        <article className="admin-panel">
          <h3>Inventory Adjustment</h3>
          <form className="admin-form" onSubmit={handleInventorySubmit}>
            <select
              value={inventoryForm.productId}
              onChange={(e) => setInventoryForm((prev) => ({ ...prev, productId: e.target.value }))}
              required
            >
              <option value="">Select product</option>
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name} (Stock: {product.stock})
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Delta (+/- quantity)"
              value={inventoryForm.delta}
              onChange={(e) => setInventoryForm((prev) => ({ ...prev, delta: e.target.value }))}
              required
            />
            <input
              placeholder="Reason"
              value={inventoryForm.reason}
              onChange={(e) => setInventoryForm((prev) => ({ ...prev, reason: e.target.value }))}
            />
            <button className="solid-btn" type="submit">
              Update Inventory
            </button>
          </form>

          <h4>Low Stock Alerts</h4>
          {lowStockList.length === 0 ? (
            <p>No low stock products.</p>
          ) : (
            <ul className="simple-list">
              {lowStockList.map((product) => (
                <li key={product._id}>
                  {product.name} - {product.stock} left
                </li>
              ))}
            </ul>
          )}
        </article>
      </div>

      <article className="admin-panel">
        <h3>Products</h3>
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>₹{product.price}</td>
                  <td>{product.stock}</td>
                  <td className="actions-cell">
                    <button type="button" className="ghost-btn" onClick={() => startEditProduct(product)}>
                      Edit
                    </button>
                    <button type="button" className="danger-btn" onClick={() => handleDeleteProduct(product._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      <article className="admin-panel">
        <h3>Orders</h3>
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>User</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>#{order._id.slice(-6).toUpperCase()}</td>
                  <td>{order.user?.name || "N/A"}</td>
                  <td>₹{order.totalAmount.toFixed(2)}</td>
                  <td>{order.paymentStatus}</td>
                  <td>{order.orderStatus}</td>
                  <td>
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      <article className="admin-panel">
        <h3>Users</h3>
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Change Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.role}</td>
                  <td>
                    <select value={user.role} onChange={(e) => handleUserRole(user._id, e.target.value)}>
                      <option value="customer">customer</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      <article className="admin-panel">
        <h3>Inventory Logs</h3>
        {inventoryLogs.length === 0 ? (
          <p>No logs yet.</p>
        ) : (
          <ul className="simple-list">
            {inventoryLogs.slice(0, 20).map((log) => (
              <li key={log._id}>
                {new Date(log.createdAt).toLocaleString()} | {log.product?.name || "Product"} | delta {log.delta} |
                stock {log.previousStock} to {log.nextStock} | by {log.changedBy?.name || "Admin"}
              </li>
            ))}
          </ul>
        )}
      </article>
    </section>
  );
};

export default AdminDashboardPage;
