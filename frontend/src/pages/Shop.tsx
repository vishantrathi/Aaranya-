import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Sparkles } from "lucide-react";
import ProductCard from "../components/ProductCard.tsx";
import { fetchLiveProducts, type LiveProduct } from "../lib/liveProducts";
import { useCartStore } from "../store/cartStore";
import { useWishlistStore } from "../store/wishlistStore";
import { useSearchStore } from "../store/searchStore";

const matchesCategory = (product: LiveProduct, selectedCategory: string) => {
  const haystack = `${product.name} ${product.category} ${product.description} ${product.tags.join(" ")}`.toLowerCase();

  switch (selectedCategory) {
    case "mangoes":
      return haystack.includes("mango") || product.category === "fruits";
    case "vegetables":
      return haystack.includes("vegetable") || product.category === "vegetables";
    case "wheat":
      return haystack.includes("wheat") || haystack.includes("atta");
    case "rice":
      return haystack.includes("rice");
    case "seasonal":
      return haystack.includes("seasonal") || product.category === "organic";
    case "best-sellers":
      return haystack.includes("best") || haystack.includes("featured") || haystack.includes("popular");
    default:
      return true;
  }
};

const Shop = () => {
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const wishlistIds = useWishlistStore((state) => state.ids);
  const toggleWishlist = useWishlistStore((state) => state.toggle);
  const searchQuery = useSearchStore((state) => state.query);
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<LiveProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [selectedQty, setSelectedQty] = useState<Record<string, number>>({});

  const selectedCategory = (searchParams.get("category") || "").toLowerCase();

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        setIsLoading(true);
        setLoadError("");
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
        setLoadError("Unable to load inventory products right now.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void loadProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.toLowerCase();

    return products.filter((product) => {
      const matchesSearch = !query.trim() ||
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query);

      const matchesSelected = !selectedCategory || matchesCategory(product, selectedCategory);
      return matchesSearch && matchesSelected;
    });
  }, [products, searchQuery, selectedCategory]);

  const handleAddToCart = async (product: LiveProduct) => {
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
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <p className="text-sm uppercase tracking-[0.16em] text-[#C2410F]">Shop</p>
        <h1 className="mt-2 text-4xl font-semibold text-[#451A03] dark:text-[#FAF7F0]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          Premium Farm Collection
        </h1>
        <p className="mt-3 max-w-2xl text-[#451A03]/75 dark:text-[#FAF7F0]/75">
          Curated seasonal produce directly from AARANYA, packed fresh and delivered quickly.
        </p>
        {selectedCategory && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#166534]/25 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#166534]">
            Category: {selectedCategory.replace("-", " ")}
            <button
              type="button"
              onClick={() => setSearchParams((prev) => {
                const next = new URLSearchParams(prev);
                next.delete("category");
                return next;
              })}
              className="rounded-full border border-[#166534]/20 px-2 py-0.5 text-[10px] hover:border-[#D97706]"
            >
              Clear
            </button>
          </div>
        )}
      </motion.div>

      {isLoading && (
        <section className="mb-8 rounded-2xl border border-[#166534]/20 bg-white p-4 text-sm text-[#451A03]/75">
          Loading live inventory...
        </section>
      )}

      {loadError && (
        <section className="mb-8 rounded-2xl border border-[#C2410F]/25 bg-[#FFF7ED] p-4 text-sm text-[#9A3412]">
          {loadError}
        </section>
      )}

      <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {filteredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <ProductCard
              product={product}
              selectedQty={selectedQty[product.id] || 1}
              isWishlisted={wishlistIds.includes(product.id)}
              isAdding={false}
              onToggleWishlist={toggleWishlist}
              onSelectQty={(id, qty) => setSelectedQty((prev) => ({ ...prev, [id]: qty }))}
              onAddToCart={handleAddToCart}
              onQuickView={(item) => navigate(`/product/${item.id}`)}
            />
          </motion.div>
        ))}
      </section>

      {filteredProducts.length === 0 && (
        <section className="mt-8 rounded-3xl border border-dashed border-[#166534]/30 bg-white p-10 text-center text-sm text-[#451A03]/75 dark:border-[#D97706]/30 dark:bg-[#191919] dark:text-[#FAF7F0]/75">
          No products matched "{searchQuery}". Try another keyword like mangoes, atta, or rice.
        </section>
      )}

      <section className="mt-12 rounded-3xl border border-[#D97706]/40 bg-[#FFF7ED] p-6 dark:bg-[#1C1A16]">
        <p className="inline-flex items-center gap-2 rounded-full bg-[#D97706]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-[#C2410F]">
          <Sparkles className="h-3.5 w-3.5" />
          Limited Harvest
        </p>
        <p className="mt-3 text-sm text-[#451A03]/75 dark:text-[#FAF7F0]/75">Weekly drops are limited. Place your order early for best variety.</p>
      </section>
    </main>
  );
};

export default Shop;
