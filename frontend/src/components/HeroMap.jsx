import { useEffect, useState } from "react";

const SLIDES = [
  {
    bg: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=1800&q=80",
    badge: "Seasonal Special",
    title: "Farm Fresh Mangoes",
    subtitle: "Direct from AARANYA — no middlemen, pure goodness.",
    ctaLabel: "Shop Mangoes",
    ctaHref: "#products",
  },
  {
    bg: "https://images.unsplash.com/photo-1518843875459-f738682238a6?auto=format&fit=crop&w=1800&q=80",
    badge: "Daily Harvest",
    title: "Fresh Vegetables Every Day",
    subtitle: "Daily harvested, locally sourced, delivered straight to your door.",
    ctaLabel: "View Vegetables",
    ctaHref: "#products",
  },
  {
    bg: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=1800&q=80",
    badge: "Farm Staples",
    title: "Grains, Jaggery & More",
    subtitle: "Traditional farm produce — wheat flour, gur, shakkar, sugarcane.",
    ctaLabel: "Explore Products",
    ctaHref: "#products",
  },
];

const HeroMap = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length);
  const next = () => setCurrent((c) => (c + 1) % SLIDES.length);

  const scrollToProducts = (href) => {
    const id = href.replace("#", "");
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const slide = SLIDES[current];

  return (
    <section className="hero-banner" aria-label="Hero banner">
      <div
        className="hero-slide"
        style={{ backgroundImage: `url(${slide.bg})` }}
      >
        <div className="hero-slide-overlay" />
        <div className="hero-slide-content container">
          <div className="hero-location-badge">Saharanpur, Uttar Pradesh</div>
          <span className="hero-slide-badge">{slide.badge}</span>
          <h1>{slide.title}</h1>
          <p>{slide.subtitle}</p>
          <div className="hero-actions">
            <button
              type="button"
              className="hero-btn-primary"
              onClick={() => scrollToProducts(slide.ctaHref)}
            >
              {slide.ctaLabel}
            </button>
            <button
              type="button"
              className="hero-btn-outline"
              onClick={() => scrollToProducts("#products")}
            >
              View All Products
            </button>
          </div>
        </div>
      </div>

      <button type="button" className="hero-prev" onClick={prev} aria-label="Previous slide">‹</button>
      <button type="button" className="hero-next" onClick={next} aria-label="Next slide">›</button>

      <div className="hero-dots" role="tablist">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === current}
            aria-label={`Slide ${i + 1}`}
            className={`hero-dot ${i === current ? "active" : ""}`}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroMap;

