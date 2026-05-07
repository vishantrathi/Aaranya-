import { FormEvent, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";
import { useCartStore } from "../store/cartStore";

const Checkout = () => {
  const navigate = useNavigate();
  const cartItems = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clear);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.qty, 0),
    [cartItems]
  );
  const delivery = subtotal >= 699 || subtotal === 0 ? 0 : 49;
  const total = subtotal + delivery;

  const handlePlaceOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (cartItems.length === 0) {
      setErrorMessage("Your cart is empty. Please add at least one product before checkout.");
      return;
    }

    if (!name.trim() || !phone.trim() || !address.trim() || !city.trim() || !pincode.trim()) {
      setErrorMessage("Please fill all delivery details.");
      return;
    }

    const shippingAddress = `${name.trim()}, ${phone.trim()}, ${address.trim()}, ${city.trim()} - ${pincode.trim()}`;

    const items = cartItems.map((item) => ({
      product: item.id,
      quantity: item.qty,
      name: item.name,
      image: item.image,
      price: item.price,
    }));

    try {
      setIsSubmitting(true);
      await api.post("/orders", {
        items,
        shippingAddress,
      });

      clearCart();
      setSuccessMessage("Order placed successfully. We will contact you shortly to confirm delivery.");
    } catch (error: any) {
      const serverMessage = error?.response?.data?.message;
      setErrorMessage(serverMessage || "Unable to place order right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <p className="text-sm uppercase tracking-[0.16em] text-[#C2410F]">Checkout</p>
        <h1 className="mt-2 text-4xl font-semibold" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          Secure Checkout
        </h1>
      </motion.div>

      <form onSubmit={handlePlaceOrder} className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-3xl border border-[#166534]/20 bg-white p-6 text-[#3B2A1A] shadow-lg lg:col-span-2">
          <h2 className="text-xl font-semibold">Delivery Details</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="rounded-xl border border-[#166534]/20 px-4 py-3 text-sm outline-none focus:border-[#D97706]"
              placeholder="Full Name"
            />
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="rounded-xl border border-[#166534]/20 px-4 py-3 text-sm outline-none focus:border-[#D97706]"
              placeholder="Phone Number"
            />
            <input
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              className="rounded-xl border border-[#166534]/20 px-4 py-3 text-sm outline-none focus:border-[#D97706] sm:col-span-2"
              placeholder="Address"
            />
            <input
              value={city}
              onChange={(event) => setCity(event.target.value)}
              className="rounded-xl border border-[#166534]/20 px-4 py-3 text-sm outline-none focus:border-[#D97706]"
              placeholder="City"
            />
            <input
              value={pincode}
              onChange={(event) => setPincode(event.target.value)}
              className="rounded-xl border border-[#166534]/20 px-4 py-3 text-sm outline-none focus:border-[#D97706]"
              placeholder="Pincode"
            />
          </div>

          {errorMessage && (
            <p className="mt-4 rounded-xl border border-[#C2410F]/30 bg-[#FFF7ED] px-4 py-3 text-sm text-[#9A3412]">
              {errorMessage}
            </p>
          )}

          {successMessage && (
            <div className="mt-4 rounded-xl border border-[#166534]/30 bg-[#F0FDF4] px-4 py-3 text-sm text-[#166534]">
              <p>{successMessage}</p>
              <button
                type="button"
                onClick={() => navigate("/shop")}
                className="mt-3 rounded-xl bg-[#166534] px-4 py-2 text-xs font-semibold text-[#FAF7F0] hover:bg-[#14532D]"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </section>

        <aside className="rounded-3xl border border-[#166534]/20 bg-white p-6 text-[#3B2A1A] shadow-lg">
          <h2 className="text-lg font-semibold">Order Summary</h2>

          <div className="mt-4 max-h-52 space-y-3 overflow-y-auto pr-1">
            {cartItems.length === 0 ? (
              <p className="text-sm text-[#451A03]/70">Your cart is empty.</p>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 text-sm">
                  <span className="line-clamp-2 flex-1">{item.name} x {item.qty}</span>
                  <span className="font-medium">₹{(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))
            )}
          </div>

          <div className="mt-4 space-y-2 border-t border-[#166534]/20 pt-3 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Delivery</span><span>{delivery === 0 ? "FREE" : `₹${delivery.toFixed(2)}`}</span></div>
            <div className="flex justify-between border-t border-[#166534]/20 pt-2 font-semibold"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || cartItems.length === 0}
            className="mt-5 w-full rounded-2xl bg-[#166534] px-4 py-3 text-sm font-semibold text-[#FAF7F0] hover:bg-[#14532D] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Placing Order..." : "Place Order"}
          </button>
        </aside>
      </form>
    </main>
  );
};

export default Checkout;
