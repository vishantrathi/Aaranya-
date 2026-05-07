export interface FarmProduct {
  id: string;
  name: string;
  category: string;
  image: string;
  price: number;
  mrp: number;
  unit: string;
  description: string;
  tags: string[];
  quantityOptions: number[];
}

export const farmProducts: FarmProduct[] = [
  {
    id: "alphonso-5kg",
    name: "Alphonso Mangoes - 5kg",
    category: "Mangoes",
    image:
      "https://images.unsplash.com/photo-1591073113125-e46713c829ed?auto=format&fit=crop&w=1200&q=80",
    price: 149,
    mrp: 179,
    unit: "kg",
    description: "Handpicked and naturally ripened Alphonso from our orchard.",
    tags: ["Mangoes", "Seasonal"],
    quantityOptions: [1, 2, 5],
  },
  {
    id: "dasheri-3kg",
    name: "Dasheri Mangoes - 3kg",
    category: "Mangoes",
    image:
      "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=1200&q=80",
    price: 129,
    mrp: 159,
    unit: "kg",
    description: "Juicy Dasheri mangoes, packed on harvest day.",
    tags: ["Mangoes", "Seasonal"],
    quantityOptions: [1, 2, 5],
  },
  {
    id: "veggie-weekly",
    name: "Farm Veggie Weekly Box",
    category: "Vegetables",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
    price: 89,
    mrp: 109,
    unit: "kg",
    description: "Fresh tomatoes, onions, greens and okra in one value box.",
    tags: ["Vegetables", "Weekly Box"],
    quantityOptions: [1, 2, 5],
  },
  {
    id: "fresh-atta",
    name: "Freshly Ground Wheat Atta",
    category: "Flour",
    image:
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1200&q=80",
    price: 72,
    mrp: 88,
    unit: "kg",
    description: "Stone-milled same day for maximum aroma and nutrition.",
    tags: ["Grains", "Fresh Milled"],
    quantityOptions: [1, 2, 5],
  },
  {
    id: "basmati-premium",
    name: "Premium Basmati Rice",
    category: "Rice",
    image:
      "https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=1200&q=80",
    price: 119,
    mrp: 139,
    unit: "kg",
    description: "Aromatic long-grain basmati cleaned and packed at source.",
    tags: ["Rice", "Premium"],
    quantityOptions: [1, 2, 5],
  },
];
