import { useEffect, useMemo, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  Leaf,
  MapPin,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Tractor,
  Truck,
  Wheat,
} from "lucide-react";
import { Link } from "react-router-dom";

import api from "../api/axios";
import { defaultSiteContent, SiteContentHero } from "../lib/siteContent";

interface HeroProps {
  hero: SiteContentHero;
  onShopNow: () => void;
  onMeetFarm: () => void;
}

interface BackendOffer {
  _id: string;
  title: string;
  offerText: string;
  image: string;
  ctaPath?: string;
}

const iconMap = {
  Sparkles,
  ShieldCheck,
  Truck,
  Tractor,
  Leaf,
  Wheat,
};

const Hero = ({ hero, onShopNow, onMeetFarm }: HeroProps) => {
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 900], [0, 90]);
  const [offers, setOffers] = useState<BackendOffer[]>([]);
  const content = useMemo(() => ({ ...defaultSiteContent.hero, ...hero }), [hero]);

  useEffect(() => {
    let isMounted = true;

    const loadOffers = async () => {
      try {
        const { data } = await api.get("/offers?placement=home");
        if (!isMounted) return;
        setOffers(Array.isArray(data) ? data : []);
      } catch {
        if (!isMounted) return;
        setOffers([]);
      }
    };

    void loadOffers();
    return () => {
      isMounted = false;
    };
  }, []);

  const titleParts = content.title.split(" to ");
  const titleFirstLine = titleParts[0] || content.title;
  const titleSecondLine = titleParts.length > 1 ? `to ${titleParts.slice(1).join(" to ")}` : "to Your Home";

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[#08120D] text-[#FAF7F0]">
      <motion.div style={{ y: bgY }} className="absolute inset-0 scale-110 bg-cover bg-center" aria-hidden="true">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `url('${content.backgroundImage}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-[#166534]/45 to-[#0B170F]/88" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(217,119,6,0.25),transparent_45%)]" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#111111]" aria-hidden="true" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-4 pb-28 pt-32 sm:px-6 lg:px-8"
      >
        <motion.div
          whileHover={{ y: -4, boxShadow: "0 30px 80px rgba(0,0,0,0.45)" }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="max-w-4xl rounded-[2rem] border border-white/20 bg-white/10 p-6 shadow-[0_25px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-10 lg:p-12"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.45 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#D97706]/45 bg-[#D97706]/15 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.14em] text-[#F8F1E3]"
          >
            <span className="text-base">🥭🥬</span>
            {content.bannerText}
          </motion.div>

          <h1 className="text-5xl font-semibold leading-[1.05] sm:text-6xl lg:text-7xl" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            {titleFirstLine}
            <span className="block text-[#D97706]">{titleSecondLine}</span>
          </h1>

          <p className="mt-5 max-w-3xl text-base text-[#FAF7F0]/90 sm:text-lg">{content.subtitle}</p>

          <div className="mt-6 flex flex-wrap gap-2.5">
            {content.trustPoints.map((point) => {
              const Icon = iconMap[point.icon as keyof typeof iconMap] || Sparkles;

              return (
                <span
                  key={point.label}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium text-[#F8F1E3]"
                >
                  <Icon className="h-3.5 w-3.5 text-[#D97706]" />
                  {point.label}
                </span>
              );
            })}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.03, y: -2 }}
              type="button"
              onClick={onShopNow}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#C2410F] px-7 py-3.5 text-sm font-semibold text-[#FAF7F0] shadow-xl transition-colors hover:bg-[#D97706]"
            >
              <ShoppingCart className="h-4 w-4" />
              {content.ctaLabel}
              <ArrowRight className="h-4 w-4" />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.03, y: -2 }}
              type="button"
              onClick={onMeetFarm}
              className="inline-flex items-center gap-2 rounded-2xl border border-[#F8F1E3]/80 bg-transparent px-7 py-3.5 text-sm font-semibold text-[#F8F1E3] transition-colors hover:bg-white/10"
            >
              <MapPin className="h-4 w-4 text-[#D97706]" />
              {content.secondaryCtaLabel}
            </motion.button>
          </div>

          <div className="mt-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#F8F1E3]/85">Today's Farm Offers</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {offers.slice(0, 3).map((offer, index) => (
                <motion.button
                  key={offer._id}
                  type="button"
                  onClick={onShopNow}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 + index * 0.08, duration: 0.45 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="group relative overflow-hidden rounded-2xl border border-white/20 text-left"
                >
                  <img
                    src={offer.image}
                    alt={offer.title}
                    className="h-28 w-full object-cover transition duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#F59E0B]">{offer.offerText}</p>
                    <p className="mt-1 text-sm font-semibold text-[#FAF7F0]">{offer.title}</p>
                  </div>
                </motion.button>
              ))}

              {offers.length === 0 && (
                <div className="rounded-2xl border border-white/25 bg-white/10 p-4 text-xs text-[#F8F1E3]/80">No live offers right now. Check back soon.</div>
              )}
            </div>
            {offers[0]?.ctaPath && (
              <Link
                to={offers[0].ctaPath}
                className="mt-3 inline-block text-xs font-semibold uppercase tracking-[0.12em] text-[#F59E0B] hover:text-[#F8F1E3]"
              >
                View Offer Details
              </Link>
            )}
          </div>
        </motion.div>
      </motion.div>

      <motion.button
        type="button"
        onClick={() => window.scrollTo({ top: window.innerHeight * 0.9, behavior: "smooth" })}
        className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2 rounded-full border border-white/25 bg-white/10 p-2 text-[#F8F1E3] backdrop-blur-xl"
        animate={{ y: [0, 8, 0], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        aria-label="Scroll down"
      >
        <ChevronDown className="h-5 w-5" />
      </motion.button>
    </section>
  );
};

export default Hero;
