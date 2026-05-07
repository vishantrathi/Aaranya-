import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface Category {
  id: string;
  title: string;
  image: string;
  slug: string;
}

interface CategoryCardProps {
  category: Category;
  index: number;
}

const CategoryCard = ({ category, index }: CategoryCardProps) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay: index * 0.04 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="group relative overflow-hidden rounded-3xl border border-[#166534]/20 bg-white shadow-lg dark:border-[#D97706]/30 dark:bg-[#191919]"
    >
      <img src={category.image} alt={category.title} className="h-44 w-full object-cover sm:h-56" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 text-[#FAF7F0]">
        <h3 className="text-lg font-semibold">{category.title}</h3>
        <Link
          to={category.slug || `/shop?category=${encodeURIComponent(category.id)}`}
          className="mt-2 inline-flex items-center gap-1 text-sm text-[#F8F1E3] hover:text-white"
        >
          Shop Now
          <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>
    </motion.article>
  );
};

export default CategoryCard;
