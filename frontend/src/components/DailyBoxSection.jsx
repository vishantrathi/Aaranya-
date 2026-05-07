import { useMemo } from "react";

import ProductCard from "./ProductCard";

const DailyBoxSection = ({ products }) => {
  const bundles = useMemo(
    () => products.filter((product) => product.tags?.includes("daily-box")),
    [products]
  );

  if (bundles.length === 0) return null;

  return (
    <section className="container section">
      <div className="section-heading">
        <h2>Daily Fresh Vegetable Box</h2>
        <p>Pre-mixed bundles at ₹199, ₹299, and ₹499 for quick healthy meals.</p>
      </div>
      <div className="product-grid">
        {bundles.map((bundle) => (
          <ProductCard key={bundle._id} product={bundle} />
        ))}
      </div>
    </section>
  );
};

export default DailyBoxSection;
