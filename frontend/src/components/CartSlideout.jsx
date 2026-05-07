import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export default function CartSlideout({ isOpen, onClose }) {
  const { cartItems, totalAmount, removeFromCart, updateQuantity } = useCart();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Slideout */}
      <div
        className={`fixed right-0 top-0 h-full w-full sm:w-96 bg-gradient-to-b from-white via-white to-primary-50 shadow-2xl z-50 transform transition-transform duration-300 overflow-y-auto border-l border-secondary-100 ${
          isOpen ? 'translate-x-0 animate-slide-in-right' : 'translate-x-full'
        }`}
      >
        {/* Header - Premium Style */}
        <div className="p-lg border-b border-secondary-200 sticky top-0 bg-gradient-to-r from-white to-primary-50 backdrop-blur-sm rounded-b-2xl shadow-md">
          <div className="flex items-center justify-between mb-md">
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-primary-700 to-primary-600 bg-clip-text text-transparent">Your Cart</h2>
              <p className="text-xs text-secondary-600 mt-xs">{cartItems.length} items</p>
            </div>
            <button
              onClick={onClose}
              className="p-sm hover:bg-primary-100 rounded-full transition-all duration-200 text-secondary-700 hover:text-primary-700 font-bold text-xl"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="p-lg">
          {cartItems.length === 0 ? (
            <div className="text-center py-2xl">
              <span className="text-4xl mb-md block">🛒</span>
              <p className="text-secondary-600 font-medium">Your cart is empty</p>
              <p className="text-xs text-secondary-500 mt-md">
                Add fresh farm products to get started
              </p>
            </div>
          ) : (
            <div className="space-y-md">
              {cartItems.map((item) => (
                <div
                  key={item.product}
                  className="flex gap-md pb-md border-b border-secondary-100 last:border-b-0"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm text-secondary-900">
                      {item.name}
                    </h4>
                    <p className="text-xs text-primary-700 font-bold mt-xs">
                      ₹{item.price} each
                    </p>
                    <div className="flex items-center gap-sm mt-md">
                      <button
                        onClick={() =>
                          updateQuantity(item.product, item.quantity - 1)
                        }
                        className="px-md py-xs bg-secondary-100 rounded hover:bg-secondary-200"
                      >
                        −
                      </button>
                      <span className="font-semibold text-sm w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product, item.quantity + 1)
                        }
                        className="px-md py-xs bg-secondary-100 rounded hover:bg-secondary-200"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(item.product)}
                        className="ml-auto text-xs text-danger hover:text-danger/70"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-lg border-t border-secondary-100 sticky bottom-0 bg-white">
            <div className="space-y-md">
              <div className="space-y-sm">
                <div className="flex justify-between text-sm text-secondary-600">
                  <span>Subtotal:</span>
                  <span>₹{totalAmount.toFixed(2)}</span>
                </div>
              <div className="flex justify-between text-sm text-secondary-600">
                  <span>Delivery:</span>
                  <span className="text-primary-700 font-semibold">
                    {totalAmount >= 500 ? 'FREE' : '₹50'}
                  </span>
                </div>
              </div>
              <div className="border-t border-secondary-100 pt-md">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-primary-700">
                    ₹{(totalAmount + (totalAmount >= 500 ? 0 : 50)).toFixed(2)}
                  </span>
                </div>
              </div>
              <button className="btn-primary w-full">Proceed to Checkout</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
