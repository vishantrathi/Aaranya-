import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const cached = localStorage.getItem("pcf_cart");
    return cached ? JSON.parse(cached) : [];
  });

  const persist = (items) => {
    setCartItems(items);
    localStorage.setItem("pcf_cart", JSON.stringify(items));
  };

  const addToCart = (product, quantity = 1) => {
    const productId = product._id || product.id;
    if (!productId) return;

    const existing = cartItems.find((item) => item.product === productId);
    if (existing) {
      const updated = cartItems.map((item) =>
        item.product === productId ? { ...item, quantity: item.quantity + quantity } : item
      );
      return persist(updated);
    }

    persist([
      ...cartItems,
      {
        product: productId,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity,
      },
    ]);
  };

  const removeFromCart = (productId) => {
    persist(cartItems.filter((item) => item.product !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) return removeFromCart(productId);

    persist(
      cartItems.map((item) =>
        item.product === productId ? { ...item, quantity: Number(quantity) } : item
      )
    );
  };

  const clearCart = () => persist([]);

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const value = useMemo(
    () => ({
      cartItems,
      totalAmount,
      totalItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    }),
    [cartItems, totalAmount, totalItems]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
