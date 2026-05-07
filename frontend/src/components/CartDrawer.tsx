import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, Truck, X } from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  image: string;
  qty: number;
  unit: string;
  price: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  subtotal: number;
  onClose: () => void;
  onUpdateQty: (id: string, qty: number) => void;
  onCheckout: () => void;
}

const CartDrawer = ({ isOpen, items, subtotal, onClose, onUpdateQty, onCheckout }: CartDrawerProps) => {
  const delivery = subtotal >= 699 ? 0 : 49;
  const total = subtotal + delivery;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-[#2A1B11]/20 backdrop-blur-[2px]"
            onClick={onClose}
            aria-label="Close cart drawer"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed right-0 top-0 z-[71] flex h-full w-full max-w-md flex-col border-l border-[#166534]/20 bg-[#FFFDF8] p-5 text-[#3B2A1A] shadow-2xl"
            aria-label="Cart drawer"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Your Cart</h3>
              <button type="button" onClick={onClose} className="rounded-full p-2 hover:bg-black/10" aria-label="Close cart">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 flex-1 space-y-3 overflow-y-auto pr-1">
              {items.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#166534]/30 bg-white p-6 text-center text-sm text-[#451A03]/75">
                  Your cart is empty. Add farm fresh products to continue.
                </div>
              ) : (
                items.map((item) => (
                  <article key={item.id} className="flex gap-3 rounded-2xl border border-[#166534]/20 bg-white p-3">
                    <img src={item.image} alt={item.name} className="h-16 w-16 rounded-xl object-cover" />
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold">{item.name}</h4>
                      <p className="text-xs text-[#451A03]/70">₹{item.price}/{item.unit}</p>
                      <div className="mt-2 inline-flex items-center gap-1 rounded-xl border border-[#166534]/20 p-1">
                        <button type="button" className="rounded-lg p-1 hover:bg-[#166534]/10" onClick={() => onUpdateQty(item.id, item.qty - 1)} aria-label="Decrease quantity">
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-7 text-center text-sm">{item.qty}</span>
                        <button type="button" className="rounded-lg p-1 hover:bg-[#166534]/10" onClick={() => onUpdateQty(item.id, item.qty + 1)} aria-label="Increase quantity">
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>

            <div className="mt-4 rounded-2xl border border-[#166534]/20 bg-white p-4">
              <div className="flex items-center justify-between text-sm">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span>Delivery</span>
                <span className="text-[#166534]">{delivery === 0 ? "FREE" : `₹${delivery}`}</span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-[#166534]/20 pt-3 text-base font-semibold">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <button
                type="button"
                onClick={onCheckout}
                disabled={items.length === 0}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#C2410F] px-4 py-3 text-sm font-semibold text-[#FAF7F0] hover:bg-[#A93A0B]"
              >
                <Truck className="h-4 w-4" />
                Proceed to Checkout
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
