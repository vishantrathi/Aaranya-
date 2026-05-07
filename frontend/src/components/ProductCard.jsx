import { useCart } from '../context/CartContext';

export default function ProductCard({ product, isHighlighted = false, featured = false }) {
  const { addToCart } = useCart();
  const isOutOfStock = typeof product.stock === 'number' && product.stock <= 0;
  const showFeatured = isHighlighted || featured;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-[#166534]/20 bg-white text-[#451A03] shadow-lg transition-shadow duration-300 hover:shadow-2xl dark:border-[#D97706]/30 dark:bg-[#191919] dark:text-[#FAF7F0]">
      <div className="relative">
        <img src={product.image} alt={product.name} className="h-56 w-full object-cover" />
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/55 backdrop-blur-sm">
            <span className="rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold text-white">Out of Stock</span>
          </div>
        )}
        {showFeatured && (
          <div className="absolute left-3 top-3 rounded-full bg-[#166534] px-3 py-1 text-xs font-semibold text-[#FAF7F0] shadow-lg">
            Featured
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <h3 className="text-lg font-semibold text-[#451A03] dark:text-[#FAF7F0]">{product.name}</h3>
          <p className="mt-1 text-sm text-[#451A03]/70 dark:text-[#FAF7F0]/70">{product.description || product.unit}</p>
        </div>

        <div className="flex items-end gap-2">
          <span className="text-2xl font-semibold text-[#166534] dark:text-[#D97706]">
            ₹{product.price}
          </span>
          <span className="text-sm text-[#451A03]/70 dark:text-[#FAF7F0]/70">/{product.unit}</span>
          {typeof product.mrp === 'number' && (
            <span className="text-sm text-[#451A03]/50 line-through dark:text-[#FAF7F0]/40">₹{product.mrp}</span>
          )}
        </div>

        {typeof product.stock === 'number' && product.stock > 0 && product.stock <= 5 && (
          <span className="inline-flex w-fit items-center rounded-full border border-[#D97706]/20 bg-[#FFF7ED] px-3 py-1 text-xs font-semibold text-[#9A3412] dark:border-[#D97706]/30 dark:bg-[#D97706]/10 dark:text-[#FBBF24]">
            Only {product.stock} left
          </span>
        )}

        <button
          onClick={() => addToCart(product)}
          disabled={isOutOfStock}
          className={`mt-auto w-full rounded-2xl px-4 py-2.5 text-sm font-semibold transition-colors ${
            isOutOfStock
              ? 'cursor-not-allowed bg-secondary-200 text-secondary-400'
              : 'bg-[#166534] text-[#FAF7F0] hover:bg-[#14532D]'
          }`}
        >
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}

