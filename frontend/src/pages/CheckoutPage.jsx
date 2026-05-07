import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const CheckoutPage = () => {
  const { auth } = useAuth();
  const { cartItems, totalAmount, totalItems, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState(auth?.address || "");
  const navigate = useNavigate();

  const canCheckout = useMemo(() => cartItems.length > 0 && address.trim(), [cartItems, address]);

  const handleCheckout = async () => {
    if (!canCheckout) return;

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      alert("Unable to load Razorpay checkout.");
      return;
    }

    try {
      setLoading(true);

      const { data: order } = await api.post("/orders", {
        items: cartItems.map((item) => ({ product: item.product, quantity: item.quantity })),
        shippingAddress: address,
      });

      const { data: paymentOrderData } = await api.post("/payments/razorpay/create-order", {
        orderId: order._id,
      });

      const options = {
        key: paymentOrderData.key || import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: paymentOrderData.razorpayOrder.amount,
        currency: "INR",
        name: "AARANYA",
        description: "Farm Fresh Order Payment",
        order_id: paymentOrderData.razorpayOrder.id,
        prefill: {
          name: auth?.name,
          email: auth?.email,
          contact: auth?.phone,
        },
        handler: async (response) => {
          await api.post("/payments/razorpay/verify", {
            orderId: order._id,
            ...response,
          });

          clearCart();
          alert("Payment successful. Your order is confirmed.");
          navigate("/orders");
        },
        theme: {
          color: "#2f7a46",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      alert(error.response?.data?.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container section page-gap">
      <div className="section-heading">
        <h2>Checkout</h2>
        <p>Secure payment via Razorpay.</p>
      </div>

      <div className="checkout-grid">
        <div className="checkout-card">
          <h3>Delivery Address</h3>
          <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows="4" />

          <h3>Order Items</h3>
          <div className="summary-list">
            {cartItems.map((item) => (
              <div key={item.product} className="checkout-item">
                <span>{item.name}</span>
                <span>
                  {item.quantity} x ₹{item.price}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="checkout-card">
          <h3>Summary</h3>
          <div className="summary-row">
            <span>Items</span>
            <strong>{totalItems}</strong>
          </div>
          <div className="summary-row">
            <span>Delivery</span>
            <strong>From Meerut farm</strong>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <h2>₹{totalAmount.toFixed(2)}</h2>
          </div>
          <button className="solid-btn" type="button" onClick={handleCheckout} disabled={loading || !canCheckout}>
            {loading ? "Processing..." : "Pay with Razorpay"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default CheckoutPage;
