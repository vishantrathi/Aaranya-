import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight, Clock, Truck, ShieldCheck, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=1600&q=80',
    badge: '🥭 Mango Season Now Live',
    badgeColor: 'from-amber-500 to-orange-500',
    title: 'Alphonso Mangoes',
    subtitle: 'Handpicked from Our Orchards',
    offer: '20% OFF',
    offerDesc: 'on all mango orders above ₹299',
    cta: 'Shop Mangoes',
    ctaPath: '/shop',
    accentColor: '#D97706',
    gradient: 'from-amber-900/85 via-orange-800/60 to-transparent',
    tag: 'Limited Season',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&q=80',
    badge: '🥦 Farm Fresh Guarantee',
    badgeColor: 'from-primary-600 to-primary-800',
    title: 'Farm-Fresh Vegetables',
    subtitle: 'Harvested Today, Delivered Tomorrow',
    offer: 'FREE DELIVERY',
    offerDesc: 'on orders above ₹499',
    cta: 'Order Veggies',
    ctaPath: '/shop',
    accentColor: '#166534',
    gradient: 'from-primary-900/90 via-primary-700/60 to-transparent',
    tag: 'Daily Harvest',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1599921841143-819065a55cc6?auto=format&fit=crop&w=1600&q=80',
    badge: '🌾 Stone-Milled Fresh Daily',
    badgeColor: 'from-yellow-600 to-amber-700',
    title: 'Freshly Ground Wheat Atta',
    subtitle: 'Same-Day Milling, Richer Nutrition',
    offer: '₹72/kg',
    offerDesc: 'vs ₹88 market price — save 18%',
    cta: 'Buy Atta Now',
    ctaPath: '/shop',
    accentColor: '#92400E',
    gradient: 'from-yellow-900/85 via-amber-800/60 to-transparent',
    tag: 'Freshly Milled',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1600&q=80',
    badge: '🍚 Premium Basmati Grade A',
    badgeColor: 'from-emerald-700 to-teal-800',
    title: 'Premium Basmati Rice',
    subtitle: 'Aromatic Long-Grain Direct from Fields',
    offer: 'BUY 5KG GET 1KG',
    offerDesc: 'free on all basmati varieties',
    cta: 'Shop Rice',
    ctaPath: '/shop',
    accentColor: '#0F766E',
    gradient: 'from-teal-900/90 via-emerald-800/60 to-transparent',
    tag: 'Direct Sourced',
  },
];

const trustBadges = [
  { icon: Truck, text: 'Free Delivery ₹499+' },
  { icon: ShieldCheck, text: '100% Organic' },
  { icon: Clock, text: 'Harvest-to-Home' },
  { icon: Zap, text: 'Same-Day Dispatch' },
];

export default function Hero() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback((index, dir = 1) => {
    setDirection(dir);
    setCurrent((index + slides.length) % slides.length);
  }, []);

  const next = useCallback(() => goTo(current + 1, 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1, -1), [current, goTo]);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [paused, next]);

  const slide = slides[current];

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  return (
    <div
      className="relative h-[500px] sm:h-[580px] md:h-[640px] overflow-hidden bg-primary-900"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      <AnimatePresence custom={direction} initial={false}>
        <motion.div
          key={slide.id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center scale-105"
            style={{ backgroundImage: `url("${slide.image}")` }}
          />
          {/* Gradient overlay */}
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

          {/* Decorative blobs */}
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20 bg-white" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full blur-3xl opacity-10 bg-amber-400" />

          {/* Content */}
          <div className="relative h-full flex items-center">
            <div className="max-w-7xl mx-auto px-6 sm:px-10 w-full">
              <div className="max-w-xl">
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: -16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="inline-flex items-center mb-4"
                >
                  <span className={`bg-gradient-to-r ${slide.badgeColor} text-white text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full shadow-lg tracking-wide`}>
                    {slide.badge}
                  </span>
                  <span className="ml-3 bg-white/20 backdrop-blur text-white text-xs font-medium px-3 py-1 rounded-full border border-white/30">
                    {slide.tag}
                  </span>
                </motion.div>

                {/* Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-2 drop-shadow-lg"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {slide.title}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="text-white/90 text-lg sm:text-xl mb-6 font-medium"
                >
                  {slide.subtitle}
                </motion.p>

                {/* Offer box */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.45, duration: 0.4 }}
                  className="inline-flex items-center gap-4 bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl px-5 py-3 mb-7 shadow-xl"
                >
                  <div>
                    <p className="text-2xl sm:text-3xl font-extrabold text-amber-300 leading-none tracking-tight">
                      {slide.offer}
                    </p>
                    <p className="text-white/80 text-xs sm:text-sm mt-0.5">{slide.offerDesc}</p>
                  </div>
                  <div className="h-10 w-px bg-white/30" />
                  <div className="text-white/70 text-xs leading-tight">
                    <p className="font-bold text-white">AARANYA</p>
                    <p>Zero Middlemen • Traceable</p>
                  </div>
                </motion.div>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55, duration: 0.4 }}
                  className="flex items-center gap-4"
                >
                  <button
                    onClick={() => navigate(slide.ctaPath)}
                    className="group flex items-center gap-2 bg-white text-primary-800 font-bold text-base sm:text-lg px-7 py-3.5 rounded-xl shadow-2xl hover:bg-amber-50 hover:scale-105 transition-all duration-200"
                  >
                    {slide.cta}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={() => navigate('/our-farm')}
                    className="text-white/90 font-semibold text-sm sm:text-base hover:text-white underline underline-offset-4 transition-colors"
                  >
                    Our Story
                  </button>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Prev/Next arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur hover:bg-white/40 text-white rounded-full p-2 sm:p-3 transition-all duration-200 shadow-lg border border-white/30 hover:scale-110"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur hover:bg-white/40 text-white rounded-full p-2 sm:p-3 transition-all duration-200 shadow-lg border border-white/30 hover:scale-110"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => goTo(i, i > current ? 1 : -1)}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? 'w-8 h-2.5 bg-amber-400'
                : 'w-2.5 h-2.5 bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Trust badges strip */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-black/40 backdrop-blur-md border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center sm:justify-between gap-4 sm:gap-0 py-2.5 flex-wrap">
            {trustBadges.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-white/90 text-xs sm:text-sm font-medium">
                <Icon className="w-4 h-4 text-amber-400 flex-shrink-0" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      {!paused && (
        <motion.div
          key={`progress-${current}`}
          className="absolute top-0 left-0 h-0.5 bg-amber-400 z-30"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 5, ease: 'linear' }}
        />
      )}
    </div>
  );
}
