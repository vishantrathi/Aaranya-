import { useCart } from '../context/CartContext';

export default function Navbar({ onCartClick }) {
  const { totalItems } = useCart();

  return (
    <nav className="sticky top-0 z-50 glass-premium border-b border-white/20 px-lg py-md shadow-2xl">
      <div className="max-w-full mx-auto">
        <div className="flex items-center justify-between gap-xl">
          {/* Logo */}
          <div className="flex items-center gap-md flex-shrink-0">
            <div className="text-3xl">🌿</div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold bg-gradient-to-r from-primary-700 to-primary-600 bg-clip-text text-transparent">
                AARANYA
              </h1>
              <p className="text-xs text-secondary-600">Premium Farm Fresh</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-lg hidden sm:block">
            <div className="glass-sm px-lg py-md">
              <input
                type="text"
                placeholder="Search vegetables, fruits, grains..."
                className="w-full bg-transparent outline-none text-sm text-secondary-900 placeholder-secondary-500"
              />
            </div>
          </div>

          {/* Cart Button */}
          <button 
            onClick={onCartClick}
            className="relative p-md hover:bg-white/20 rounded-xl transition-all duration-200 group"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform duration-200">🛒</span>
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 bg-gradient-to-r from-primary-700 to-primary-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Search */}
        <div className="mt-md sm:hidden">
          <input
            type="text"
            placeholder="Search..."
            className="input-field text-sm"
          />
        </div>
      </div>
    </nav>
  );
}

