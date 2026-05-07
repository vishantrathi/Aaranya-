import { motion } from "framer-motion";

const OurFarm = () => {
  return (
    <main className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
      <motion.div
        initial={{ opacity: 0, x: -18 }}
        animate={{ opacity: 1, x: 0 }}
        className="rounded-3xl border border-[#166534]/20 bg-[#FFFDF7] p-6 shadow-lg dark:border-[#D97706]/30 dark:bg-[#161616]"
      >
        <p className="text-sm uppercase tracking-[0.16em] text-[#C2410F]">Our Farm</p>
        <h1 className="mt-2 text-4xl font-semibold text-[#2F1708] dark:text-[#F8E9D2]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          Rooted in Soil, Raised by Family
        </h1>
        <p className="mt-5 text-base leading-8 text-[#3B2314] dark:text-[#F5E7D1]">
          AARANYA is a multi-generation family farm in Uttar Pradesh dedicated to chemical-free practices,
          responsible water use, and transparent traceability from field to kitchen.
        </p>
        <ul className="mt-6 space-y-3 text-sm text-[#3B2314] dark:text-[#F5E7D1]">
          <li className="rounded-xl bg-[#166534]/8 px-3 py-2 dark:bg-[#D97706]/10">100% farm-direct supply chain</li>
          <li className="rounded-xl bg-[#166534]/8 px-3 py-2 dark:bg-[#D97706]/10">Field-level batch tracking and QR traceability</li>
          <li className="rounded-xl bg-[#166534]/8 px-3 py-2 dark:bg-[#D97706]/10">Same-day milling for fresh atta orders</li>
          <li className="rounded-xl bg-[#166534]/8 px-3 py-2 dark:bg-[#D97706]/10">Sustainable crop rotation and soil nutrition programs</li>
        </ul>
      </motion.div>
      <motion.div initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} className="overflow-hidden rounded-3xl shadow-2xl">
        <img
          src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1500&q=80"
          alt="Family farm landscape"
          className="h-full w-full object-cover"
        />
      </motion.div>
    </main>
  );
};

export default OurFarm;
