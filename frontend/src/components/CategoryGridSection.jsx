const CATEGORY_ITEMS = [
  {
    title: "Mangoes",
    subtitle: "Seasonal varieties",
    image:
      "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Vegetables",
    subtitle: "Daily harvest",
    image:
      "https://images.unsplash.com/photo-1518843875459-f738682238a6?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Wheat Flour",
    subtitle: "Stone-ground",
    image:
      "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Rice Flour",
    subtitle: "Freshly milled",
    image:
      "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Jaggery (Gur)",
    subtitle: "Natural sweetener",
    image:
      "https://images.unsplash.com/photo-1723145143306-c16a7612ef95?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Shakkar",
    subtitle: "Unrefined sweetness",
    image:
      "https://images.unsplash.com/photo-1610211118846-318a5f4f6f94?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Sugarcane",
    subtitle: "Fresh-cut stalks",
    image:
      "https://images.unsplash.com/photo-1587720041146-b5f72a9ddf0f?auto=format&fit=crop&w=600&q=80",
  },
];

const CategoryGridSection = () => {
  const scrollToProducts = () => {
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="container section">
      <div className="section-heading">
        <h2>Shop by Category</h2>
        <p>Explore farm-fresh produce and staples directly from AARANYA.</p>
      </div>

      <div className="category-grid">
        {CATEGORY_ITEMS.map((item) => (
          <button key={item.title} className="category-card" type="button" onClick={scrollToProducts}>
            <img src={item.image} alt={item.title} />
            <div className="category-card-body">
              <h3>{item.title}</h3>
              <p>{item.subtitle}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default CategoryGridSection;

