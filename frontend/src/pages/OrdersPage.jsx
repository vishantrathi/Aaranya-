import { useEffect, useState } from "react";

import api from "../api/axios";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/orders/my");
        setOrders(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <section className="container section page-gap">
      <div className="section-heading">
        <h2>Order History</h2>
        <p>Track your order status: Pending, Confirmed, and Delivered.</p>
      </div>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="empty-state">
          <h3>No orders yet</h3>
          <p>Once you place an order, it will appear here with payment and delivery status.</p>
        </div>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => (
            <article key={order._id} className="order-card">
              <h4>Order #{order._id.slice(-6).toUpperCase()}</h4>
              <p>Total: ₹{order.totalAmount.toFixed(2)}</p>
              <span className={`status-pill status-${order.orderStatus.toLowerCase()}`}>{order.orderStatus}</span>
              <p>Payment: {order.paymentStatus}</p>
              <p>Items: {order.items?.length || 0}</p>
              <p>Date: {new Date(order.createdAt).toLocaleString()}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default OrdersPage;
