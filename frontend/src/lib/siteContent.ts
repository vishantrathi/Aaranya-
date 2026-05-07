export interface SiteContentTrustPoint {
  label: string;
  icon: string;
}

export interface SiteContentCategory {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  slug: string;
}

export interface SiteContentWhyChooseItem {
  icon: string;
  title: string;
  text: string;
}

export interface SiteContentTestimonial {
  id: string;
  name: string;
  city: string;
  image: string;
  quote: string;
}

export interface SiteContentHero {
  bannerText: string;
  title: string;
  subtitle: string;
  backgroundImage: string;
  ctaLabel: string;
  secondaryCtaLabel: string;
  trustPoints: SiteContentTrustPoint[];
}

export interface SiteContentStory {
  badge: string;
  title: string;
  description: string;
  image: string;
  highlights: string[];
}

export interface SiteContentSeasonal {
  badge: string;
  title: string;
  subtitle: string;
  endAt: string;
}

export interface SiteContentFooterLink {
  label: string;
  path: string;
}

export interface SiteContentFooterContact {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
}

export interface SiteContentFooter {
  brandDescription: string;
  quickLinks: SiteContentFooterLink[];
  categories: SiteContentFooterLink[];
  contact: SiteContentFooterContact;
  policies: SiteContentFooterLink[];
}

export interface SiteContent {
  key: string;
  farmName: string;
  location: string;
  description: string;
  hero: SiteContentHero;
  categories: SiteContentCategory[];
  whyChoose: SiteContentWhyChooseItem[];
  story: SiteContentStory;
  testimonials: SiteContentTestimonial[];
  seasonal: SiteContentSeasonal;
  footer: SiteContentFooter;
}

export const defaultSiteContent: SiteContent = {
  key: "primary",
  farmName: "AARANYA",
  location: "Meerut, Uttar Pradesh",
  description:
    "Direct from our farm to your home with live inventory, transparent pricing, and family-grown produce.",
  hero: {
    bannerText: "Harvested at Dawn, Delivered Fresh",
    title: "Fresh from Our Fields to Your Home",
    subtitle: "Direct from AARANYA • Zero Middlemen • 100% Chemical-Free and Organic",
    backgroundImage:
      "https://images.unsplash.com/photo-1586771107445-d3ca888129ce?auto=format&fit=crop&w=2000&q=80",
    ctaLabel: "Shop Fresh Now",
    secondaryCtaLabel: "Meet Our Farm",
    trustPoints: [
      { label: "Family Owned Since 1998", icon: "Sparkles" },
      { label: "Traceable to the Field", icon: "ShieldCheck" },
      { label: "1-2 Day Delivery Across India", icon: "Truck" },
    ],
  },
  categories: [
    {
      id: "mangoes",
      title: "Mangoes",
      subtitle: "Seasonal varieties",
      image:
        "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=1200&q=80",
      slug: "/shop?category=mangoes",
    },
    {
      id: "vegetables",
      title: "Fresh Vegetables",
      subtitle: "Daily harvest",
      image:
        "https://images.unsplash.com/photo-1518843875459-f738682238a6?auto=format&fit=crop&w=1200&q=80",
      slug: "/shop?category=vegetables",
    },
    {
      id: "wheat",
      title: "Wheat Flour",
      subtitle: "Stone-ground",
      image:
        "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=1200&q=80",
      slug: "/shop?category=wheat",
    },
    {
      id: "rice",
      title: "Rice Flour",
      subtitle: "Freshly milled",
      image:
        "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=80",
      slug: "/shop?category=rice",
    },
    {
      id: "seasonal",
      title: "Seasonal Harvest",
      subtitle: "Limited monthly drops",
      image:
        "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1200&q=80",
      slug: "/shop?category=seasonal",
    },
    {
      id: "best-sellers",
      title: "Best Sellers",
      subtitle: "Most ordered by families",
      image:
        "https://images.unsplash.com/photo-1471194402529-8e0f5a675de6?auto=format&fit=crop&w=1200&q=80",
      slug: "/shop?category=best-sellers",
    },
  ],
  whyChoose: [
    {
      icon: "Tractor",
      title: "Direct from Farm",
      text: "No middlemen, just harvest-to-home supply with complete freshness.",
    },
    {
      icon: "Leaf",
      title: "Chemical-Free and Organic",
      text: "Sustainably grown with natural methods and tested quality standards.",
    },
    {
      icon: "ShieldCheck",
      title: "Traceable to the Field",
      text: "QR-based traceability on each packet for full source transparency.",
    },
    {
      icon: "Wheat",
      title: "Freshly Ground Atta",
      text: "Same-day milling preserves aroma, taste and nutrition in every bag.",
    },
  ],
  story: {
    badge: "Our Story",
    title: "Three generations of responsible farming",
    description:
      "AARANYA began as a small family field and has grown into a trusted source for chemical-free produce in India. Every mango, grain, and flour packet carries our family promise of purity, traceability, and fair farming practices.",
    image:
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1300&q=80",
    highlights: ["Farm-to-door across India", "Certified quality checks"],
  },
  testimonials: [
    {
      id: "t1",
      name: "Neha Arora",
      city: "Delhi",
      image:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80",
      quote: "The mangoes tasted exactly like childhood summer vacations in my nani's village.",
    },
    {
      id: "t2",
      name: "Rakesh Mehta",
      city: "Jaipur",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
      quote: "Their wheat atta is unbelievably fresh. Rotis are softer and naturally aromatic.",
    },
    {
      id: "t3",
      name: "Aparna Iyer",
      city: "Bengaluru",
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
      quote: "Trustworthy quality, direct farm traceability, and genuinely fast delivery.",
    },
    {
      id: "t4",
      name: "Amit Sinha",
      city: "Lucknow",
      image:
        "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=800&q=80",
      quote: "The weekly vegetable box is now a non-negotiable part of our home routine.",
    },
  ],
  seasonal: {
    badge: "Seasonal Limited Harvest",
    title: "Mango season is live. Limited stock, premium lots.",
    subtitle:
      "Reserve your family box before this harvest closes. Next batch may have different sweetness and variety availability.",
    endAt: "2026-06-30T23:59:59.000Z",
  },
  footer: {
    brandDescription:
      "Direct from our farm in Meerut, Uttar Pradesh — fresh mangoes, seasonal vegetables, grains, jaggery, and more. No middlemen. Transparent pricing.",
    quickLinks: [
      { label: "Home", path: "/" },
      { label: "Products", path: "/shop" },
      { label: "Daily Box", path: "/shop?category=vegetables" },
      { label: "My Orders", path: "/orders" },
    ],
    categories: [
      { label: "Mangoes", path: "/shop?category=mangoes" },
      { label: "Fresh Vegetables", path: "/shop?category=vegetables" },
      { label: "Wheat & Rice Flour", path: "/shop?category=wheat" },
      { label: "Jaggery & Shakkar", path: "/shop?category=seasonal" },
      { label: "Sugarcane", path: "/shop?category=seasonal" },
    ],
    contact: {
      phone: "+91 99999 99999",
      whatsapp: "919999999999",
      email: "info@aaranya.in",
      address: "Meerut, Uttar Pradesh",
    },
    policies: [
      { label: "Privacy Policy", path: "/privacy" },
      { label: "Terms of Use", path: "/terms" },
      { label: "Refund Policy", path: "/refund" },
    ],
  },
};