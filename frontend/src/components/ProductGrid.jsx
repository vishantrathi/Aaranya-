import ProductCard from './ProductCard';

export default function ProductGrid({ products, title }) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-2xl px-lg animate-fade-in">
        <span className="text-5xl mb-md block">🥕</span>
        <p className="text-secondary-600 font-medium">No products found in this category</p>
        <p className="text-secondary-500 text-sm mt-md">Try browsing other categories</p>
      </div>
    );
  }

  return (
    <section className="px-lg py-2xl bg-gradient-to-b from-white via-primary-50/30 to-white animate-fade-in">
      <div className="max-w-full mx-auto">
        {title && (
          <div className="mb-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary-700 to-primary-600 bg-clip-text text-transparent mb-md">
              {title}
            </h2>
            <p className="text-secondary-600 text-sm">Handpicked fresh produce delivered daily</p>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-md">
          {products.map((product, index) => (
            <div key={product._id} className="animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
              <ProductCard
                product={product}
                isHighlighted={product.isFeaturedMango}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
