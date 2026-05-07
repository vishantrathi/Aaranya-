import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  Leaf,
  MapPin,
  ShieldCheck,
  Timer,
  Tractor,
  Wheat,
  X,
  Star,
  Instagram,
  Facebook,
  MessageCircle,
  Sparkles,
} from "lucide-react";

import Hero from "../components/Hero.tsx";
import CategoryCard from "../components/CategoryCard";
import ProductCard from "../components/ProductCard.tsx";
import api from "../api/axios";
import { defaultSiteContent, SiteContent } from "../lib/siteContent";
import { fetchLiveProducts, type LiveProduct } from "../lib/liveProducts";
import { useCartStore } from "../store/cartStore";
import { useWishlistStore } from "../store/wishlistStore";
import { useSearchStore } from "../store/searchStore";

const getCountdown = (seasonEndAt: string) => {
  const seasonEnd = new Date(seasonEndAt).getTime();
  const now = Date.now();
  const diff = Math.max(seasonEnd - now, 0);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);

  return { days, hours, minutes };
};

const iconMap = {
  Tractor,
  Leaf,
  ShieldCheck,
  Wheat,
  Sparkles,
};

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<LiveProduct[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent>(defaultSiteContent);
  const [selectedQty, setSelectedQty] = useState<Record<string, number>>({});
  const [addingState, setAddingState] = useState<Record<string, boolean>>({});
  const [quickView, setQuickView] = useState<LiveProduct | null>(null);
  const [countdown, setCountdown] = useState(getCountdown(defaultSiteContent.seasonal.endAt));
  const [inventoryError, setInventoryError] = useState("");

  const addItem = useCartStore((state) => state.addItem);
  const wishlistIds = useWishlistStore((state) => state.ids);
  const toggleWishlist = useWishlistStore((state) => state.toggle);
  const searchTerm = useSearchStore((state) => state.query);

  useEffect(() => {
    let isMounted = true;

    const loadContent = async () => {
      try {
        const { data } = await api.get("/site-content");
        if (!isMounted) return;

        if (data && typeof data === "object") {
          setSiteContent({ ...defaultSiteContent, ...data });
        }
      } catch {
        if (!isMounted) return;
        setSiteContent(defaultSiteContent);
      }
    };

    void loadContent();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const updateCountdown = () => {
      setCountdown(getCountdown(siteContent.seasonal.endAt));
    };

    updateCountdown();
    const timer = window.setInterval(updateCountdown, 60000);
    return () => window.clearInterval(timer);
  }, [siteContent.seasonal.endAt]);

  useEffect(() => {
    let isMounted = true;

    const loadInventory = async () => {
      try {
        setInventoryError("");
        const data = await fetchLiveProducts();
        if (!isMounted) return;

        setProducts(data);
        setSelectedQty((prev) => {
          const next = { ...prev };
          for (const product of data) {
            if (!next[product.id]) {
              next[product.id] = 1;
            }
          }
          return next;
        });
      } catch {
        if (!isMounted) return;
        setInventoryError("Unable to load live inventory right now.");
      }
    };

    void loadInventory();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) {
      return products;
    }

    return products.filter((product) => {
      const query = searchTerm.toLowerCase();
      return (
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    });
  }, [products, searchTerm]);

  const handleAddToCart = async (product: LiveProduct) => {
    setAddingState((prev) => ({ ...prev, [product.id]: true }));

    await new Promise((resolve) => setTimeout(resolve, 450));

    const qty = selectedQty[product.id] || 1;
    addItem(
      {
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        unit: product.unit,
      },
      qty
    );

    setAddingState((prev) => ({ ...prev, [product.id]: false }));
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45 }}
      className="bg-[#FAF7F0] text-[#451A03] dark:bg-[#111111] dark:text-[#FAF7F0]"
    >
      <Hero
        hero={siteContent.hero}
        onShopNow={() => navigate("/shop")}
        onMeetFarm={() => navigate("/our-farm")}
      />

      <section id="shop-categories" className="relative mx-auto -mt-16 max-w-7xl bg-gradient-to-b from-[#111111] via-[#F8F1E3]/80 to-transparent px-4 pt-24 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <p className="text-sm uppercase tracking-[0.16em] text-[#C2410F]">Shop by Category</p>
          <h2 className="mt-2 text-3xl font-semibold sm:text-4xl" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Handpicked from {siteContent.farmName}
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {siteContent.categories.map((category, index) => (
            <CategoryCard key={category.id} category={category} index={index} />
          ))}
        </div>
      </section>

      <section id="featured-products" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <p className="text-sm uppercase tracking-[0.16em] text-[#C2410F]">Featured Products</p>
          <h2 className="mt-2 text-3xl font-semibold sm:text-4xl" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Fresh Harvest This Week
          </h2>
          <p className="mt-3 max-w-3xl text-[#451A03]/80 dark:text-[#FAF7F0]/80">
            {siteContent.description}
          </p>
        </motion.div>

        {inventoryError && (
          <div className="mb-5 rounded-2xl border border-[#C2410F]/25 bg-[#FFF7ED] p-4 text-sm text-[#9A3412]">
            {inventoryError}
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {filteredProducts.map((product, index) => {
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
              >
                <ProductCard
                  product={product}
                  selectedQty={selectedQty[product.id] || 1}
                  isWishlisted={wishlistIds.includes(product.id)}
                  isAdding={Boolean(addingState[product.id])}
                  onToggleWishlist={toggleWishlist}
                  onSelectQty={(id, qty) => setSelectedQty((prev) => ({ ...prev, [id]: qty }))}
                  onAddToCart={handleAddToCart}
                  onQuickView={setQuickView}
                />
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <p className="text-sm uppercase tracking-[0.16em] text-[#C2410F]">Why Choose Us</p>
          <h2 className="mt-2 text-3xl font-semibold sm:text-4xl" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Built on trust, purity, and family values
          </h2>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {siteContent.whyChoose.map((item, index) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap] || Tractor;

            return (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: index * 0.05 }}
              whileHover={{ y: -3, scale: 1.01 }}
              className="rounded-3xl border border-[#166534]/20 bg-white p-6 shadow-lg dark:border-[#D97706]/30 dark:bg-[#191919]"
            >
              <Icon className="h-7 w-7 text-[#C2410F]" />
              <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-[#451A03]/75 dark:text-[#FAF7F0]/75">{item.text}</p>
            </motion.article>
            );
          })}
        </div>
      </section>

      <section id="our-story" className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55 }}
          className="overflow-hidden rounded-3xl shadow-xl"
        >
          <img
            src={siteContent.story.image}
            alt={siteContent.story.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55 }}
          className="self-center"
        >
          <p className="text-sm uppercase tracking-[0.16em] text-[#C2410F]">{siteContent.story.badge}</p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            {siteContent.story.title}
          </h2>
          <p className="mt-5 text-base leading-8 text-[#451A03]/85 dark:text-[#FAF7F0]/80">
            {siteContent.story.description}
          </p>
          <div className="mt-7 flex flex-wrap gap-4 text-sm">
            {siteContent.story.highlights.map((highlight) => (
              <span key={highlight} className="inline-flex items-center gap-2 rounded-full border border-[#166534]/25 bg-[#166534]/10 px-4 py-2 dark:border-[#D97706]/30 dark:bg-[#D97706]/10">
                <MapPin className="h-4 w-4" />
                {highlight}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <p className="text-sm uppercase tracking-[0.16em] text-[#C2410F]">Testimonials</p>
          <h2 className="mt-2 text-3xl font-semibold sm:text-4xl" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Loved by families across India
          </h2>
        </motion.div>

        <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0">
          {siteContent.testimonials.map((testimonial, index) => (
            <motion.article
              key={testimonial.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="min-w-[82%] snap-start rounded-3xl border border-[#166534]/20 bg-white p-5 shadow-lg dark:border-[#D97706]/30 dark:bg-[#191919] lg:min-w-0"
            >
              <div className="flex items-center gap-3">
                <img src={testimonial.image} alt={testimonial.name} className="h-12 w-12 rounded-full object-cover" loading="lazy" />
                <div>
                  <h3 className="font-semibold">{testimonial.name}</h3>
                  <p className="text-sm text-[#451A03]/70 dark:text-[#FAF7F0]/70">{testimonial.city}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-0.5 text-[#D97706]">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <Star key={`${testimonial.id}-${starIndex}`} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-3 text-sm leading-7 text-[#451A03]/80 dark:text-[#FAF7F0]/80">"{testimonial.quote}"</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.45 }}
          className="relative overflow-hidden rounded-3xl border border-[#D97706]/40 bg-gradient-to-r from-[#451A03] via-[#6B2E10] to-[#C2410F] p-8 text-[#FAF7F0] shadow-2xl"
        >
          <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#D97706]/20 blur-2xl" aria-hidden="true" />
          <p className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1 text-xs font-medium uppercase tracking-[0.12em]">
            <Timer className="h-3.5 w-3.5" />
            {siteContent.seasonal.badge}
          </p>
          <h2 className="mt-4 text-3xl font-semibold sm:text-4xl" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            {siteContent.seasonal.title}
          </h2>
          <p className="mt-2 max-w-2xl text-[#FAF7F0]/90">
            {siteContent.seasonal.subtitle}
          </p>
          <div className="mt-5 flex flex-wrap gap-3 text-sm">
            <span className="rounded-xl bg-white/15 px-4 py-2">{countdown.days} days</span>
            <span className="rounded-xl bg-white/15 px-4 py-2">{countdown.hours} hours</span>
            <span className="rounded-xl bg-white/15 px-4 py-2">{countdown.minutes} minutes</span>
          </div>
        </motion.div>
      </section>

      <footer className="border-t border-[#166534]/20 bg-[#F8F1E3] dark:border-[#D97706]/20 dark:bg-[#0D0D0D]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <h2 className="text-3xl font-semibold" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Stay close to {siteContent.farmName}
            </h2>
            <p className="mt-3 max-w-md text-[#451A03]/80 dark:text-[#FAF7F0]/80">
              {siteContent.footer.brandDescription}
            </p>
            <form className="mt-5 flex flex-wrap gap-2">
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="min-w-[220px] flex-1 rounded-2xl border border-[#166534]/25 bg-white px-4 py-3 text-sm outline-none focus:border-[#D97706] dark:border-[#D97706]/30 dark:bg-[#171717]"
                aria-label="Email address"
              />
              <button type="submit" className="rounded-2xl bg-[#166534] px-5 py-3 text-sm font-semibold text-[#FAF7F0] hover:bg-[#14532D]">
                Subscribe for farm updates
              </button>
            </form>
          </div>

          <div className="grid grid-cols-2 gap-6 text-sm md:grid-cols-4">
            <div>
              <h3 className="mb-3 text-base font-semibold">Quick Links</h3>
              <ul className="space-y-2 text-[#451A03]/80 dark:text-[#FAF7F0]/80">
                {siteContent.footer.quickLinks.map((link) => (
                  <li key={link.label}>
                    <Link to={link.path}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-3 text-base font-semibold">Contact</h3>
              <ul className="space-y-2 text-[#451A03]/80 dark:text-[#FAF7F0]/80">
                <li>{siteContent.farmName}, {siteContent.footer.contact.address}</li>
                <li>{siteContent.footer.contact.phone}</li>
                <li>{siteContent.footer.contact.email}</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 text-base font-semibold">Categories</h3>
              <ul className="space-y-2 text-[#451A03]/80 dark:text-[#FAF7F0]/80">
                {siteContent.footer.categories.map((link) => (
                  <li key={link.label}>
                    <Link to={link.path}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-3 text-base font-semibold">Policies</h3>
              <ul className="space-y-2 text-[#451A03]/80 dark:text-[#FAF7F0]/80">
                {siteContent.footer.policies.map((link) => (
                  <li key={link.label}>
                    <Link to={link.path}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 flex items-center gap-3 md:col-span-4">
              <a href="https://instagram.com" className="rounded-full border border-[#166534]/30 p-2 hover:bg-[#166534]/10" aria-label="Instagram">
                <Instagram className="h-4 w-4" />
              </a>
              <a href={`https://wa.me/${siteContent.footer.contact.whatsapp}`} className="rounded-full border border-[#166534]/30 p-2 hover:bg-[#166534]/10" aria-label="WhatsApp">
                <MessageCircle className="h-4 w-4" />
              </a>
              <a href="https://facebook.com" className="rounded-full border border-[#166534]/30 p-2 hover:bg-[#166534]/10" aria-label="Facebook">
                <Facebook className="h-4 w-4" />
              </a>
            </div>
            <div className="col-span-2 rounded-2xl border border-[#166534]/20 bg-white/70 p-4 text-[#451A03]/80 dark:border-[#D97706]/30 dark:bg-[#171717] dark:text-[#FAF7F0]/80">
              <p>Secure Checkout • UPI, Cards, Netbanking • Made with love in India</p>
            </div>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {quickView && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setQuickView(null)}
              className="fixed inset-0 z-[60] bg-black/45"
              aria-label="Close quick view"
            />
            <motion.aside
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 25 }}
              transition={{ duration: 0.25 }}
              className="fixed left-1/2 top-1/2 z-[61] w-[92%] max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border border-[#166534]/20 bg-[#FAF7F0] shadow-2xl dark:border-[#D97706]/30 dark:bg-[#171717]"
              role="dialog"
              aria-modal="true"
              aria-label="Product quick view"
            >
              <button
                type="button"
                onClick={() => setQuickView(null)}
                className="absolute right-4 top-4 rounded-full bg-black/20 p-2 text-white"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="grid md:grid-cols-2">
                <img src={quickView.image} alt={quickView.name} className="h-72 w-full object-cover md:h-full" />
                <div className="p-6">
                  <p className="text-xs uppercase tracking-[0.14em] text-[#C2410F]">Quick View</p>
                  <h3 className="mt-2 text-2xl font-semibold">{quickView.name}</h3>
                  <p className="mt-2 text-sm text-[#451A03]/75 dark:text-[#FAF7F0]/75">{quickView.description}</p>
                  <p className="mt-4 text-2xl font-semibold text-[#166534] dark:text-[#D97706]">₹{quickView.price}/{quickView.unit}</p>
                  <button
                    type="button"
                    onClick={() => {
                      void handleAddToCart(quickView);
                      setQuickView(null);
                    }}
                    className="mt-6 rounded-2xl bg-[#166534] px-5 py-3 text-sm font-semibold text-[#FAF7F0] hover:bg-[#14532D]"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

    </motion.main>
  );
};

export default Home;
