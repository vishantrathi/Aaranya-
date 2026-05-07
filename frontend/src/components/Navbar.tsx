import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import {
  ChevronDown,
  CircleUserRound,
  Heart,
  LogOut,
  Menu,
  Moon,
  Package,
  Search,
  ShoppingCart,
  Sun,
  User,
  X,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface NavbarProps {
  cartCount: number;
  wishlistCount: number;
  darkMode: boolean;
  searchValue: string;
  onToggleDarkMode: () => void;
  onSearchChange: (value: string) => void;
  onCartClick: () => void;
}

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Shop", path: "/shop" },
  { label: "Our Farm", path: "/our-farm" },
  { label: "Blog", path: "/blog" },
  { label: "About Us", path: "/about" },
];

/** Thin decorative divider used between icon actions */
const VDivider = () => (
  <span className="mx-1 h-5 w-px bg-[#C9A84C]/25" aria-hidden="true" />
);

const Navbar = ({
  cartCount,
  wishlistCount,
  darkMode,
  searchValue,
  onToggleDarkMode,
  onSearchChange,
  onCartClick,
}: NavbarProps) => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, auth } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { scrollYProgress } = useScroll();

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setScrolled(latest > 0.05);
  });

  const handleProfileClick = () => {
    navigate("/profile");
    setProfileOpen(false);
  };

  const handleOrdersClick = () => {
    navigate("/orders");
    setProfileOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setProfileOpen(false);
  };

  const handleLoginClick = () => {
    navigate("/login");
    setProfileOpen(false);
  };

  const handleSignupClick = () => {
    navigate("/signup");
    setProfileOpen(false);
  };

  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        setProfileOpen(false);
      }
    };

    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, []);

  return (
    <motion.header
      className="sticky top-0 z-50"
      animate={{
        backgroundColor: scrolled
          ? "rgba(8,8,8,0.97)"
          : "rgba(8,8,8,0.55)",
        borderBottomColor: scrolled
          ? "rgba(201,168,76,0.45)"
          : "rgba(201,168,76,0.18)",
        backdropFilter: "blur(24px)",
      }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={{ borderBottomWidth: 1 }}
    >
      {/* Subtle gold shimmer line at very top */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.55) 40%, rgba(201,168,76,0.55) 60%, transparent 100%)" }}
        aria-hidden="true"
      />

      <nav
        className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 lg:px-10"
        aria-label="Primary"
      >
        {/* ── Brand ── */}
        <NavLink
          to="/"
          className="group flex items-center gap-3 flex-shrink-0"
          aria-label="AARANYA Home"
        >
          {/* Monogram medallion */}
          <span className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-[#C9A84C]/60 bg-[#0F0F0F] shadow-[0_0_18px_rgba(201,168,76,0.18)] transition-all duration-400 group-hover:border-[#C9A84C]/90 group-hover:shadow-[0_0_28px_rgba(201,168,76,0.35)]">
            <img
              src="/image.png"
              alt="AARANYA logo"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </span>

          {/* Word-mark */}
          <div className="leading-tight">
            <p
              className="text-[15px] font-semibold tracking-[0.06em] text-[#EDE0C4] transition-colors duration-300 group-hover:text-[#C9A84C]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              AARANYA
            </p>
            <p
              className="text-[9px] tracking-[0.25em] text-[#C9A84C]/80 uppercase"
            >
              Premium Farm Fresh
            </p>
          </div>
        </NavLink>

        {/* ── Desktop nav links ── */}
        <ul className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `group relative text-[11px] font-medium tracking-[0.18em] uppercase transition-colors duration-300 ${
                    isActive
                      ? "text-[#C9A84C]"
                      : "text-[#EDE0C4]/80 hover:text-[#EDE0C4]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    <span
                      className={`absolute -bottom-1 left-0 h-px bg-[#C9A84C] transition-all duration-300 ${
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* ── Desktop actions ── */}
        <div className="hidden items-center gap-1 lg:flex">
          {/* Search */}
          <label className="relative" aria-label="Search products">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#C9A84C]/60" />
            <input
              type="search"
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search products…"
              className="w-52 rounded-full border border-[#C9A84C]/20 bg-white/5 py-2 pl-8 pr-3 text-[11px] tracking-wide text-[#EDE0C4] outline-none transition-all duration-300 placeholder:text-[#EDE0C4]/35 focus:w-64 focus:border-[#C9A84C]/55 focus:bg-white/8 focus:ring-1 focus:ring-[#C9A84C]/25"
            />
          </label>

          <VDivider />

          {/* Wishlist */}
          <button
            type="button"
            aria-label="Wishlist"
            className="relative rounded-full p-2.5 text-[#EDE0C4]/70 transition-all duration-200 hover:bg-[#C9A84C]/10 hover:text-[#C9A84C]"
          >
            <Heart className="h-[18px] w-[18px]" />
            {wishlistCount > 0 && (
              <span className="absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-[#C9A84C] px-0.5 text-[9px] font-bold text-[#080808]">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart */}
          <button
            type="button"
            aria-label="Cart"
            onClick={onCartClick}
            className="relative rounded-full p-2.5 text-[#EDE0C4]/70 transition-all duration-200 hover:bg-[#C9A84C]/10 hover:text-[#C9A84C]"
          >
            <ShoppingCart className="h-[18px] w-[18px]" />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.4, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 420, damping: 18 }}
                  className="absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-[#C9A84C] px-0.5 text-[9px] font-bold text-[#080808]"
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Dark mode */}
          <button
            type="button"
            onClick={onToggleDarkMode}
            aria-label="Toggle dark mode"
            className="rounded-full p-2.5 text-[#EDE0C4]/70 transition-all duration-200 hover:bg-[#C9A84C]/10 hover:text-[#C9A84C]"
          >
            <motion.span
              className="block"
              animate={{ rotate: darkMode ? 180 : 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {darkMode ? (
                <Sun className="h-[18px] w-[18px] text-[#C9A84C]" />
              ) : (
                <Moon className="h-[18px] w-[18px]" />
              )}
            </motion.span>
          </button>

          <VDivider />

          {/* Profile / Auth */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((prev) => !prev)}
                aria-haspopup="menu"
                aria-expanded={profileOpen}
                className="flex items-center gap-1.5 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/8 px-3 py-1.5 text-[#EDE0C4] transition-all duration-200 hover:border-[#C9A84C]/70 hover:bg-[#C9A84C]/14"
              >
                <span className="grid h-7 w-7 place-items-center rounded-full border border-[#C9A84C]/50 bg-[#C9A84C]/20 text-[#C9A84C]">
                  <User className="h-3.5 w-3.5" />
                </span>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-[#C9A84C]/70 transition-transform duration-300 ${profileOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute right-0 mt-2.5 w-44 overflow-hidden rounded-xl border border-[#C9A84C]/25 bg-[#111]/95 shadow-[0_20px_60px_rgba(0,0,0,0.7)] backdrop-blur-2xl"
                    role="menu"
                  >
                    {/* Header accent */}
                    <div className="h-px bg-gradient-to-r from-transparent via-[#C9A84C]/50 to-transparent" aria-hidden="true" />
                    <div className="p-1.5">
                      <div className="px-3 py-2 text-xs text-[#EDE0C4]/60 border-b border-[#C9A84C]/15 mb-1">
                        {auth?.name || auth?.email}
                      </div>
                      <button
                        type="button"
                        onClick={handleProfileClick}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs tracking-wide text-[#EDE0C4]/80 transition-colors duration-150 hover:bg-[#C9A84C]/10 hover:text-[#C9A84C]"
                        role="menuitem"
                      >
                        <CircleUserRound className="h-3.5 w-3.5" />
                        Profile
                      </button>
                      <button
                        type="button"
                        onClick={handleOrdersClick}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs tracking-wide text-[#EDE0C4]/80 transition-colors duration-150 hover:bg-[#C9A84C]/10 hover:text-[#C9A84C]"
                        role="menuitem"
                      >
                        <Package className="h-3.5 w-3.5" />
                        Orders
                      </button>
                      <div className="my-1 h-px bg-[#C9A84C]/15" aria-hidden="true" />
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs tracking-wide text-red-400/80 transition-colors duration-150 hover:bg-red-900/20 hover:text-red-400"
                        role="menuitem"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        Sign Out
                      </button>
                    </div>
                    <div className="h-px bg-gradient-to-r from-transparent via-[#C9A84C]/30 to-transparent" aria-hidden="true" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleLoginClick}
                className="rounded-full border border-[#C9A84C]/50 px-4 py-1.5 text-[11px] font-medium tracking-wide text-[#C9A84C] transition-all duration-200 hover:bg-[#C9A84C]/10"
              >
                Log In
              </button>
              <button
                type="button"
                onClick={handleSignupClick}
                className="rounded-full bg-gradient-to-r from-[#C9A84C] to-[#D4B860] px-4 py-1.5 text-[11px] font-medium tracking-wide text-[#080808] transition-all duration-200 hover:shadow-lg hover:shadow-[#C9A84C]/30"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>

        {/* ── Mobile actions ── */}
        <div className="flex items-center gap-1 lg:hidden">
          <button
            type="button"
            onClick={onToggleDarkMode}
            aria-label="Toggle dark mode"
            className="rounded-full p-2 text-[#EDE0C4]/70"
          >
            <motion.span className="block" animate={{ rotate: darkMode ? 180 : 0 }} transition={{ duration: 0.35 }}>
              {darkMode ? (
                <Sun className="h-5 w-5 text-[#C9A84C]" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </motion.span>
          </button>

          <button
            type="button"
            onClick={onCartClick}
            aria-label="Open cart"
            className="relative rounded-full p-2 text-[#EDE0C4]/70"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <motion.span
                key={`mobile-${cartCount}`}
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 420, damping: 18 }}
                className="absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-[#C9A84C] px-0.5 text-[9px] font-bold text-[#080808]"
              >
                {cartCount}
              </motion.span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="rounded-full p-2 text-[#EDE0C4]/70"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
              aria-label="Close mobile menu"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.32, ease: [0.32, 0, 0.08, 1] }}
              className="fixed right-0 top-0 z-50 flex h-full w-full max-w-xs flex-col gap-6 border-l border-[#C9A84C]/20 bg-[#080808]/97 p-6 shadow-[0_0_80px_rgba(0,0,0,0.9)] backdrop-blur-2xl sm:w-80"
              aria-label="Mobile menu"
            >
              {/* Top accent */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/60 to-transparent" aria-hidden="true" />

              <div className="flex items-center justify-between">
                <p
                  className="text-base font-semibold tracking-[0.1em] text-[#EDE0C4]"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  AARANYA
                </p>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="rounded-full p-1.5 text-[#EDE0C4]/60 transition-colors hover:bg-[#C9A84C]/10 hover:text-[#C9A84C]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <label className="relative" aria-label="Search products">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#C9A84C]/50" />
                <input
                  type="search"
                  value={searchValue}
                  onChange={(event) => onSearchChange(event.target.value)}
                  placeholder="Search products…"
                  className="w-full rounded-full border border-[#C9A84C]/20 bg-white/5 py-2 pl-8 pr-3 text-[11px] tracking-wide text-[#EDE0C4] outline-none placeholder:text-[#EDE0C4]/35 focus:border-[#C9A84C]/50"
                />
              </label>

              <ul className="space-y-1">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <NavLink
                      to={link.path}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        `group flex items-center justify-between rounded-lg px-3 py-2.5 text-[11px] font-medium tracking-[0.15em] uppercase transition-colors duration-200 ${
                          isActive
                            ? "bg-[#C9A84C]/10 text-[#C9A84C]"
                            : "text-[#EDE0C4]/70 hover:bg-white/5 hover:text-[#EDE0C4]"
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>

              <div className="h-px bg-[#C9A84C]/15" aria-hidden="true" />

              {isAuthenticated ? (
                <div className="space-y-2 rounded-xl border border-[#C9A84C]/15 bg-white/3 p-3">
                  <div className="text-xs text-[#EDE0C4]/60 px-3 py-1">
                    {auth?.name || auth?.email}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      handleProfileClick();
                      setMobileOpen(false);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs text-[#EDE0C4]/80 hover:bg-[#C9A84C]/10 hover:text-[#C9A84C]"
                  >
                    <CircleUserRound className="h-3.5 w-3.5" />
                    Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleOrdersClick();
                      setMobileOpen(false);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs text-[#EDE0C4]/80 hover:bg-[#C9A84C]/10 hover:text-[#C9A84C]"
                  >
                    <Package className="h-3.5 w-3.5" />
                    Orders
                  </button>
                  <div className="h-px bg-[#C9A84C]/20" aria-hidden="true" />
                  <button
                    type="button"
                    onClick={() => {
                      handleLogout();
                      setMobileOpen(false);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs text-red-400 hover:bg-red-900/20"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleLoginClick();
                      setMobileOpen(false);
                    }}
                    className="w-full rounded-full border border-[#C9A84C]/50 px-4 py-2 text-xs font-medium text-[#C9A84C] hover:bg-[#C9A84C]/10"
                  >
                    Log In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleSignupClick();
                      setMobileOpen(false);
                    }}
                    className="w-full rounded-full bg-gradient-to-r from-[#C9A84C] to-[#D4B860] px-4 py-2 text-xs font-medium text-[#080808] hover:shadow-lg"
                  >
                    Sign Up
                  </button>
                </div>
              )}

              <div className="space-y-3 rounded-xl border border-[#C9A84C]/15 bg-white/3 p-4">
                <div className="flex items-center justify-between text-[11px] tracking-wide text-[#EDE0C4]/70">
                  <span className="flex items-center gap-2"><Heart className="h-3.5 w-3.5 text-[#C9A84C]/70" /> Wishlist</span>
                  <span className="text-[#C9A84C]">{wishlistCount}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] tracking-wide text-[#EDE0C4]/70">
                  <span className="flex items-center gap-2"><ShoppingCart className="h-3.5 w-3.5 text-[#C9A84C]/70" /> Cart</span>
                  <span className="text-[#C9A84C]">{cartCount}</span>
                </div>
              </div>

              {/* Bottom accent */}
              <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/40 to-transparent" aria-hidden="true" />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
