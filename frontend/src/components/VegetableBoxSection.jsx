import ProductCard from './ProductCard';

export default function VegetableBoxSection({ products }) {
  // Filter products that are in daily box
  const boxProducts = products.filter(p => p.tags?.includes('daily-box'));

  if (!boxProducts || boxProducts.length === 0) return null;

  return (
    <section className="px-lg py-2xl bg-gradient-to-b from-primary-50 via-primary-25 to-white border-y-2 border-primary-200 animate-fade-in">
      <div className="max-w-full mx-auto">
        {/* Premium Header with Backdrop Blur */}
        <div className="mb-2xl p-2xl rounded-2xl glass-premium border border-primary-200/50">
          <div className="animate-scale-in">
            <div className="badge badge-success mb-lg inline-block">
              🥬 Premium Collection
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary-700 to-primary-600 bg-clip-text text-transparent mb-md">
              Daily Fresh Vegetable Box
            </h2>
            <p className="text-secondary-700 max-w-xl">
              Pre-mixed bundles at unbeatable prices. Curated by our expert farmers for daily meals. Free delivery on orders above ₹500.
            </p>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-md">
          {boxProducts.map((product) => (
            <div key={product._id} className="animate-fade-in">
              <ProductCard
                product={product}
                isHighlighted={true}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
