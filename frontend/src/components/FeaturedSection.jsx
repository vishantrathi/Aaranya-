export default function FeaturedSection() {
  const features = [
    {
      icon: '🍎',
      title: 'Fresh Fruits',
      description: 'Handpicked daily from our orchards',
      image: 'https://images.unsplash.com/photo-1599599810694-67281a3265ce?auto=format&fit=crop&w=600&q=80',
      color: 'from-red-400 to-red-600',
    },
    {
      icon: '🥕',
      title: 'Organic Vegetables',
      description: 'Farm-fresh, pesticide-free produce',
      image: 'https://images.unsplash.com/photo-1599599830694-67281a3265cf?auto=format&fit=crop&w=600&q=80',
      color: 'from-orange-400 to-orange-600',
    },
    {
      icon: '🌾',
      title: 'Premium Grains',
      description: 'Pure, unprocessed whole grains',
      image: 'https://images.unsplash.com/photo-1599599830694-67281a3265d0?auto=format&fit=crop&w=600&q=80',
      color: 'from-amber-400 to-amber-600',
    },
    {
      icon: '🍯',
      title: 'Natural Sweets',
      description: 'Honey, jaggery, and organic sugar',
      image: 'https://images.unsplash.com/photo-1599599830694-67281a3265d1?auto=format&fit=crop&w=600&q=80',
      color: 'from-yellow-400 to-yellow-600',
    },
  ];

  return (
    <section className="px-lg py-4xl bg-gradient-to-b from-white via-primary-50/30 to-white">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="text-center mb-4xl animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary-700 to-primary-600 bg-clip-text text-transparent mb-md">
            ✨ Why Choose Us
          </h2>
          <p className="text-secondary-600 max-w-2xl mx-auto">
            Experience the finest farm-fresh produce delivered directly to your doorstep
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2xl">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass-premium p-2xl rounded-2xl border border-white/30 hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-full h-40 rounded-xl bg-gradient-to-br ${feature.color} mb-2xl overflow-hidden shadow-lg`}>
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover hover-zoom"
                />
              </div>
              <div className="text-center">
                <span className="text-4xl mb-md block">{feature.icon}</span>
                <h3 className="text-lg font-bold text-secondary-900 mb-md">
                  {feature.title}
                </h3>
                <p className="text-sm text-secondary-600">
                  {feature.description}
                </p>
              </div>
              <button className="w-full mt-2xl py-md rounded-lg bg-gradient-to-r from-primary-700 to-primary-600 text-white font-semibold hover:shadow-lg transition-all duration-200 active:scale-95">
                Explore {feature.icon}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
