import { motion } from "framer-motion";
import { Heart } from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  price: number;
  mrp: number;
  unit: string;
  description: string;
  tags: string[];
  quantityOptions: number[];
  stock?: number;
  isOrganic?: boolean;
  isInSeason?: boolean;
}

interface ProductCardProps {
  product: Product;
  selectedQty: number;
  isWishlisted: boolean;
  isAdding: boolean;
  onToggleWishlist: (id: string) => void;
  onSelectQty: (id: string, qty: number) => void;
  onAddToCart: (product: Product) => Promise<void>;
  onQuickView: (product: Product) => void;
}

const ProductCard = ({
  product,
  selectedQty,
  isWishlisted,
  isAdding,
  onToggleWishlist,
  onSelectQty,
  onAddToCart,
  onQuickView,
}: ProductCardProps) => {
  const isOutOfStock = typeof product.stock === "number" && product.stock <= 0;

  return (
    <motion.article
      whileHover={{ y: -4, scale: 1.01 }}
      className="flex h-full flex-col overflow-hidden rounded-3xl border border-[#166534]/20 bg-white text-[#451A03] shadow-lg transition-shadow hover:shadow-2xl dark:border-[#D97706]/30 dark:bg-[#191919] dark:text-[#FAF7F0]"
    >
      <div className="relative">
        <img src={product.image} alt={product.name} className="h-56 w-full object-cover" loading="lazy" />
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/55 backdrop-blur-sm">
            <span className="rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold text-white">Out of Stock</span>
          </div>
        )}
        {(product.isOrganic || product.isInSeason) && (
          <div className="absolute left-3 top-3 flex gap-2">
            {product.isOrganic && (
              <span className="rounded-full bg-[#166534] px-3 py-1 text-xs font-medium text-[#FAF7F0]">Organic</span>
            )}
            {product.isInSeason && (
              <span className="rounded-full bg-[#D97706] px-3 py-1 text-xs font-medium text-[#FAF7F0]">In Season</span>
            )}
          </div>
        )}
        <button
          type="button"
          aria-label="Toggle wishlist"
          onClick={() => onToggleWishlist(product.id)}
          className="absolute right-3 top-3 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm"
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? "fill-white" : ""}`} />
        </button>
      </div>

      <div className="flex flex-1 flex-col space-y-4 p-5">
        <div>
          <h3 className="text-lg font-semibold text-[#451A03] dark:text-[#FAF7F0]">{product.name}</h3>
          <p className="mt-1 text-sm text-[#451A03]/70 dark:text-[#FAF7F0]/70">{product.description}</p>
        </div>

        <div className="flex items-end gap-2">
          <span className="text-2xl font-semibold text-[#166534] dark:text-[#D97706]">₹{product.price}</span>
          <span className="text-sm text-[#451A03]/70 dark:text-[#FAF7F0]/70">/{product.unit}</span>
          <span className="text-sm text-[#451A03]/50 line-through dark:text-[#FAF7F0]/40">₹{product.mrp}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {product.quantityOptions.map((qtyOption) => (
            <button
              type="button"
              key={qtyOption}
              onClick={() => onSelectQty(product.id, qtyOption)}
              className={`rounded-xl border px-3 py-1.5 text-sm ${
                selectedQty === qtyOption
                  ? "border-[#C2410F] bg-[#C2410F] text-[#FAF7F0]"
                  : "border-[#166534]/20 bg-transparent hover:border-[#D97706]"
              }`}
            >
              {qtyOption}kg
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => void onAddToCart(product)}
            disabled={isAdding || isOutOfStock}
            className="flex-1 rounded-2xl bg-[#166534] px-4 py-2.5 text-sm font-semibold text-[#FAF7F0] transition-colors hover:bg-[#14532D] disabled:opacity-70"
          >
            {isOutOfStock ? "Out of Stock" : isAdding ? "Adding..." : "Add to Cart"}
          </motion.button>

          <button
            type="button"
            onClick={() => onQuickView(product)}
            className="rounded-2xl border border-[#166534]/30 px-4 py-2.5 text-sm font-semibold text-[#451A03] hover:border-[#D97706] dark:text-[#FAF7F0]"
          >
            Quick View
          </button>
        </div>
      </div>
    </motion.article>
  );
};

export default ProductCard;
