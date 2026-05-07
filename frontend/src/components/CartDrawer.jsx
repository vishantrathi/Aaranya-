import { Link } from "react-router-dom";

import { useCart } from "../context/CartContext";

const CartDrawer = ({ isOpen, onClose }) => {
  const { cartItems, totalAmount, removeFromCart, updateQuantity } = useCart();

  return (
    <>
      <div className={`cart-backdrop ${isOpen ? "show" : ""}`} onClick={onClose} />
      <aside className={`cart-drawer ${isOpen ? "open" : ""}`}>
        <div className="cart-header">
          <h3>Your Cart</h3>
          <button className="ghost-btn" onClick={onClose}>
            Close
          </button>
        </div>

        {cartItems.length > 0 && (
          <div className="cart-summary">
            <div className="cart-summary-row">
              <span>Items:</span>
              <span className="amount">{cartItems.length}</span>
            </div>
            <div className="cart-summary-row">
              <span>Subtotal:</span>
              <span className="amount">₹{totalAmount.toFixed(2)}</span>
            </div>
            <div className="cart-summary-row">
              <span>Delivery:</span>
              <span className="amount">{totalAmount >= 500 ? "FREE" : "₹50"}</span>
            </div>
            <div className="cart-summary-row">
              <span>Est. Delivery:</span>
              <span className="amount">Tomorrow</span>
            </div>
            <div className="cart-summary-row total">
              <span>Total:</span>
              <span className="amount">₹{(totalAmount + (totalAmount >= 500 ? 0 : 50)).toFixed(2)}</span>
            </div>
          </div>
        )}

        <div className="cart-items">
          {cartItems.length === 0 ? (
            <div className="empty-state cart-empty">
              <div className="empty-state-icon">🛒</div>
              <h3>Your cart is empty</h3>
              <p>Add products from the farm store to see them here.</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.product} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div className="cart-item-body">
                  <h4>{item.name}</h4>
                  <p>₹{item.price} each</p>
                  <div className="quantity-row">
                    <button type="button" className="quantity-btn" onClick={() => updateQuantity(item.product, item.quantity - 1)}>
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.product, e.target.value)}
                    />
                    <button type="button" className="quantity-btn" onClick={() => updateQuantity(item.product, item.quantity + 1)}>
                      +
                    </button>
                  </div>
                </div>
                <button className="danger-btn" onClick={() => removeFromCart(item.product)}>
                  Remove
                </button>
              </div>
            ))
          )}
        </div>

        <div className="cart-footer">
          <h4>Total: ₹{(totalAmount + (totalAmount >= 500 ? 0 : 50)).toFixed(2)}</h4>
          <Link className="solid-btn" to="/checkout" onClick={onClose}>
            Proceed to Checkout
          </Link>
        </div>
      </aside>
    </>
  );
};

export default CartDrawer;
