export default function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Priya Singh',
      location: 'Delhi',
      rating: 5,
      text: 'The freshness and quality of vegetables is unmatched! Delivery is always on time.',
      image: '👩‍🌾',
    },
    {
      name: 'Rajesh Kumar',
      location: 'Saharanpur',
      rating: 5,
      text: 'Finally found a reliable source for organic produce. Highly recommended!',
      image: '👨‍🌾',
    },
    {
      name: 'Anita Verma',
      location: 'Meerut',
      rating: 5,
      text: 'The best farm-to-home service. Direct from farmers without any middlemen markup.',
      image: '👩‍💼',
    },
    {
      name: 'Vikram Tomar',
      location: 'Agra',
      rating: 5,
      text: 'Superior quality at fair prices. Love the premium packaging too!',
      image: '👨‍💼',
    },
  ];

  return (
    <section className="px-lg py-4xl bg-gradient-to-b from-white to-primary-50">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="text-center mb-4xl animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary-700 to-primary-600 bg-clip-text text-transparent mb-md">
            ⭐ Loved by {(1500 + Math.random() * 500).toFixed(0)}+ Customers
          </h2>
          <p className="text-secondary-600 max-w-2xl mx-auto">
            See what our customers say about their experience
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2xl">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="glass-premium p-2xl rounded-2xl border border-white/30 hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Rating */}
              <div className="flex gap-xs mb-2xl">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-xl">⭐</span>
                ))}
              </div>

              {/* Text */}
              <p className="text-secondary-700 mb-2xl text-sm leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-md">
                <span className="text-3xl">{testimonial.image}</span>
                <div>
                  <p className="font-bold text-secondary-900 text-sm">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-secondary-500">
                    📍 {testimonial.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Social Proof */}
        <div className="mt-4xl pt-4xl border-t border-secondary-200 grid grid-cols-3 gap-2xl text-center">
          <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-primary-700 to-primary-600 bg-clip-text text-transparent">
              1000+
            </h3>
            <p className="text-secondary-600 text-sm mt-md">Happy Customers</p>
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-primary-700 to-primary-600 bg-clip-text text-transparent">
              5000+
            </h3>
            <p className="text-secondary-600 text-sm mt-md">Deliveries Done</p>
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-primary-700 to-primary-600 bg-clip-text text-transparent">
              98%
            </h3>
            <p className="text-secondary-600 text-sm mt-md">Satisfaction Rate</p>
          </div>
        </div>
      </div>
    </section>
  );
}
