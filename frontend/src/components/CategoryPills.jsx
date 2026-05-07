import { useState } from 'react';

const CATEGORIES = [
  { id: 'all', label: 'All', icon: '🛍️' },
  { id: 'fruits', label: 'Fruits', icon: '🍎' },
  { id: 'vegetables', label: 'Vegetables', icon: '🥕' },
  { id: 'grains', label: 'Grains', icon: '🌾' },
  { id: 'organic', label: 'Organic', icon: '✅' },
  { id: 'non-organic', label: 'Non-organic', icon: '📦' },
];

export default function CategoryPills({ onCategoryChange }) {
  const [activeCategory, setActiveCategory] = useState('all');

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    onCategoryChange?.(categoryId);
  };

  return (
    <div className="glass-premium mx-0 border-b border-white/20 px-lg py-md sticky top-14 z-40 m-0">
      <div className="max-w-full overflow-x-auto scrollbar-hide">
        <div className="flex gap-md pb-md">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`flex items-center gap-sm px-lg py-md rounded-full font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0 shadow-md border ${
                activeCategory === category.id
                  ? 'bg-gradient-to-r from-primary-700 to-primary-600 text-white shadow-lg scale-105 animate-scale-in border-primary-500'
                  : 'glass-sm text-secondary-700 hover:shadow-lg hover:border-primary-300'
              }`}
            >
              <span className="text-lg">{category.icon}</span>
              <span>{category.label}</span>
            </button>
          ))}
        </div>
      </div>

      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
