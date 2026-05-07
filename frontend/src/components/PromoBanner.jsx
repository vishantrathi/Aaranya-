export default function PromoBanner() {
  return (
    <section className="px-lg py-2xl bg-gradient-to-r from-primary-700 via-primary-600 to-primary-500 overflow-hidden">
      <div className="max-w-full mx-auto relative">
        {/* Background Decoration */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />

        {/* Content */}
        <div className="relative z-10 text-white text-center">
          <div className="mb-2xl">
            <span className="inline-block bg-white/30 backdrop-blur-md px-lg py-md rounded-full text-sm font-bold mb-md">
              🎉 SPECIAL OFFER
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-md">
              Get 20% OFF on Your First Order
            </h2>
            <p className="text-lg opacity-90 mb-2xl max-w-2xl mx-auto">
              Use code <span className="font-bold bg-white/20 px-md py-sm rounded">FRESH20</span> • Free delivery on orders above ₹500
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-md justify-center items-center">
            <button className="px-2xl py-lg bg-white text-primary-700 font-bold rounded-lg hover:bg-primary-50 transition-all duration-200 shadow-lg hover:shadow-2xl active:scale-95">
              🛍️ Shop Now
            </button>
            <button className="px-2xl py-lg bg-white/20 backdrop-blur-md text-white font-bold rounded-lg border border-white/30 hover:bg-white/30 transition-all duration-200 shadow-lg active:scale-95">
              📱 Learn More
            </button>
          </div>

          {/* Benefits */}
          <div className="mt-2xl grid grid-cols-3 gap-xl text-center text-sm">
            <div className="glass-dark p-md rounded-lg">
              <span className="text-2xl block mb-md">📦</span>
              <p className="font-semibold">Free Delivery</p>
            </div>
            <div className="glass-dark p-md rounded-lg">
              <span className="text-2xl block mb-md">⚡</span>
              <p className="font-semibold">Super Fast</p>
            </div>
            <div className="glass-dark p-md rounded-lg">
              <span className="text-2xl block mb-md">✅</span>
              <p className="font-semibold">100% Fresh</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
