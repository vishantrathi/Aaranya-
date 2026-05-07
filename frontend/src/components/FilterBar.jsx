const FILTERS = ["all", "fruits", "vegetables", "grains", "organic", "non-organic"];

const FilterBar = ({ activeFilter, setActiveFilter, searchTerm, setSearchTerm }) => {
  return (
    <div className="filter-wrap">
      <div className="chips">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            type="button"
            className={`chip ${activeFilter === filter ? "chip-active" : ""}`}
            onClick={() => setActiveFilter(filter)}
            role="tab"
            aria-selected={activeFilter === filter}
          >
            <span>
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </span>
          </button>
        ))}
      </div>

      <div className="filter-search-row">
        <input
          className="search-input"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search products"
        />
        {(activeFilter !== "all" || searchTerm) && (
          <button
            type="button"
            className="ghost-btn clear-filter-btn"
            onClick={() => {
              setActiveFilter("all");
              setSearchTerm("");
            }}
            aria-label="Clear all filters"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
