import { useEffect, useMemo, useState } from "react";

import api from "../api/axios";
import CategoryGridSection from "../components/CategoryGridSection";
import DailyBoxSection from "../components/DailyBoxSection";
import FilterBar from "../components/FilterBar";
import Footer from "../components/Footer";
import HeroMap from "../components/HeroMap";
import ProductCard from "../components/ProductCard";
import SkeletonCard from "../components/SkeletonCard";

const SHOPPING_PROMOS = [
  {
    title: "Deals you can't miss",
    text: "Seasonal mango highlights, fresh vegetables, and value boxes ready to order.",
    tone: "promo-card promo-card-primary",
    action: "Shop mangoes",
    target: "#products",
  },
  {
    title: "Daily Fresh Vegetable Box",
    text: "Bundle your weekly vegetables with simple, transparent pricing.",
    tone: "promo-card promo-card-secondary",
    action: "View boxes",
    target: "#daily-box",
  },
  {
    title: "Fast farm support",
    text: "Need help ordering? Use WhatsApp for a quick direct conversation.",
    tone: "promo-card promo-card-tertiary",
    action: "Open WhatsApp",
    target: "https://wa.me/919999999999?text=Hello%20Aaranya%2C%20I%20want%20to%20order%20fresh%20produce.",
  },
];

const QUICK_CTA = ["Fresh mangoes", "Weekly vegetables", "Value boxes", "Farm staples"];

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/products");
        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => !product.tags?.includes("daily-box"))
      .filter((product) => {
        if (activeFilter === "all") return true;
        return product.category === activeFilter || product.tags?.includes(activeFilter);
      })
      .filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [products, activeFilter, searchTerm]);

  const mangoProducts = filteredProducts.filter((product) => product.isFeaturedMango);
  const normalProducts = filteredProducts.filter((product) => !product.isFeaturedMango);
  const featuredDeals = [
    mangoProducts[0],
    products.find((product) => product.tags?.includes("daily-box") && product.price === 299),
    products.find((product) => product.category === "vegetables" && !product.tags?.includes("daily-box")),
  ].filter(Boolean);

  return (
    <main className="page-gap">
      <HeroMap />
      <CategoryGridSection />

      <section className="container section trust-strip">
        <div className="trust-card">
          <div className="trust-card-icon">🚜</div>
          <div>
            <h3>Direct from Farmer</h3>
            <p>No commission agents. Transparent farm pricing.</p>
          </div>
        </div>
        <div className="trust-card">
          <div className="trust-card-icon">🌱</div>
          <div>
            <h3>Real Farm Produce</h3>
            <p>Daily harvested vegetables and seasonal mangoes.</p>
          </div>
        </div>
        <div className="trust-card">
          <div className="trust-card-icon">⚡</div>
          <div>
            <h3>Fast Local Delivery</h3>
            <p>Quick dispatch from Meerut to your doorstep.</p>
          </div>
        </div>
        <div className="trust-card">
          <div className="trust-card-icon">🔒</div>
          <div>
            <h3>Secure Payments</h3>
            <p>Pay safely via Razorpay or Cash on Delivery.</p>
          </div>
        </div>
      </section>

      <section className="container section promo-section">
        <div className="section-heading">
          <h2>Marketplace picks</h2>
          <p>Quick entry points inspired by marketplace-style shopping, built around AARANYA.</p>
        </div>

        <div className="promo-grid">
          {SHOPPING_PROMOS.map((promo) => (
            <article key={promo.title} className={promo.tone}>
              <p className="promo-label">Featured</p>
              <h3>{promo.title}</h3>
              <p>{promo.text}</p>
              {promo.target.startsWith("#") ? (
                <a className="promo-link" href={promo.target}>
                  {promo.action}
                </a>
              ) : (
                <a className="promo-link" href={promo.target} target="_blank" rel="noreferrer">
                  {promo.action}
                </a>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="container section quick-cta-section">
        <div className="quick-cta-card">
          <div>
            <p className="promo-label">Convenience</p>
            <h2>Order farm fresh produce in the fastest way possible.</h2>
            <p>Browse, add to cart, pay securely, and get direct farm support if needed.</p>
          </div>
          <div className="quick-cta-pills">
            {QUICK_CTA.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </section>

      <section id="products" className="container section">
        <div className="section-heading">
          <h2>Farm Products</h2>
          <p>Choose from mangoes, vegetables, grains, jaggery, shakkar, and sugarcane.</p>
        </div>

        <FilterBar
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        <div className="results-bar">
          <p>
            Showing <strong>{filteredProducts.length}</strong> product{filteredProducts.length === 1 ? "" : "s"}
          </p>
        </div>

        {loading ? (
          <div>
            <div className="empty-state" style={{ borderStyle: "none", padding: "24px 0", marginTop: "0" }}>
              <div className="empty-state-icon">⏳</div>
              <h3>Loading farm products...</h3>
              <p>Fetching fresh produce from our inventory</p>
            </div>
            <div className="product-grid" style={{ marginTop: "24px" }}>
              <SkeletonCard count={6} />
            </div>
          </div>
        ) : (
          <>
            {featuredDeals.length > 0 && (
              <div className="featured-block featured-deals-block">
                <div className="featured-block-head">
                  <div>
                    <p className="promo-label">Deals you can't miss</p>
                    <h3>Curated farm picks</h3>
                  </div>
                  <a href="#products" className="text-link">
                    Browse all →
                  </a>
                </div>
                <div className="product-grid deal-grid">
                  {featuredDeals.map((product, index) => (
                    <ProductCard key={product._id} product={product} featured={true} index={index} />
                  ))}
                </div>
              </div>
            )}

            {mangoProducts.length > 0 && (
              <div className="featured-block">
                <h3>🥭 Mango Special</h3>
                <div className="product-grid">
                  {mangoProducts.map((product, index) => (
                    <ProductCard key={product._id} product={product} featured={true} index={index} />
                  ))}
                </div>
              </div>
            )}

            <div className="product-grid">
              {normalProducts.map((product, index) => (
                <ProductCard key={product._id} product={product} index={index} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="empty-state">
                <div className="empty-state-icon">🔍</div>
                <h3>No products found</h3>
                <p>Try a different search or clear your filters to see all fresh farm products.</p>
                <button
                  type="button"
                  className="ghost-btn"
                  onClick={() => {
                    setActiveFilter("all");
                    setSearchTerm("");
                  }}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <section id="daily-box">
        <DailyBoxSection products={products} />
      </section>
      <Footer />
    </main>
  );
};

export default HomePage;
