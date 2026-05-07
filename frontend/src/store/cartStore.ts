import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  image: string;
  qty: number;
  unit: string;
  price: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  updateQty: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item, qty = 1) =>
        set((state) => {
          const existing = state.items.find((cartItem) => cartItem.id === item.id);
          if (existing) {
            return {
              items: state.items.map((cartItem) =>
                cartItem.id === item.id ? { ...cartItem, qty: cartItem.qty + qty } : cartItem
              ),
            };
          }

          return { items: [...state.items, { ...item, qty }] };
        }),
      updateQty: (id, qty) =>
        set((state) => {
          if (qty <= 0) {
            return { items: state.items.filter((item) => item.id !== id) };
          }

          return {
            items: state.items.map((item) => (item.id === id ? { ...item, qty } : item)),
          };
        }),
      removeItem: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
      clear: () => set({ items: [] }),
    }),
    {
      name: "pcf-cart-store",
    }
  )
);
