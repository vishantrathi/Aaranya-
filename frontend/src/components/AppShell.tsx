import { useEffect, useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import Navbar from "./Navbar.tsx";
import CartDrawer from "./CartDrawer.tsx";
import AiChatWidget from "./AiChatWidget.tsx";
import { useCartStore } from "../store/cartStore";
import { useWishlistStore } from "../store/wishlistStore";
import { getCartCount, getCartSubtotal } from "../store/selectors";
import { useSearchStore } from "../store/searchStore";

const AppShell = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const cartItems = useCartStore((state) => state.items);
  const updateQty = useCartStore((state) => state.updateQty);
  const wishlistIds = useWishlistStore((state) => state.ids);
  const searchQuery = useSearchStore((state) => state.query);
  const setSearchQuery = useSearchStore((state) => state.setQuery);

  const cartCount = useMemo(() => getCartCount(cartItems), [cartItems]);
  const subTotal = useMemo(() => getCartSubtotal(cartItems), [cartItems]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", darkMode);
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);

    if (value.trim() && location.pathname !== "/shop") {
      navigate("/shop");
    }
  };

  return (
    <>
      <Navbar
        cartCount={cartCount}
        wishlistCount={wishlistIds.length}
        darkMode={darkMode}
        searchValue={searchQuery}
        onToggleDarkMode={() => setDarkMode((prev) => !prev)}
        onSearchChange={handleSearchChange}
        onCartClick={() => setCartOpen(true)}
      />
      <Outlet />
      <CartDrawer
        isOpen={cartOpen}
        items={cartItems}
        subtotal={subTotal}
        onClose={() => setCartOpen(false)}
        onUpdateQty={updateQty}
        onCheckout={() => {
          setCartOpen(false);
          navigate("/checkout");
        }}
      />
      <AiChatWidget />
    </>
  );
};

export default AppShell;
