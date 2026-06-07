import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const BannerSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden rounded-2xl">
 
      <motion.img
        src="https://plus.unsplash.com/premium_photo-1699982290061-819c51d39690?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Banner"
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.6, ease: "easeOut" }}
        className="absolute inset-0 w-full h-full object-cover"
      />
 
      <div className="absolute inset-0 bg-white/70 dark:bg-black/70 transition-colors duration-500" />
 
      <div className="relative z-10 max-w-5xl px-6 text-center text-black dark:text-white">
 
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="block mb-6 text-sm tracking-[0.3em] uppercase opacity-70"
        >
          Limited Time Only
        </motion.span>
 
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-tight"
        >
          Enjoy 20% Off on a Wide <br className="hidden sm:block" />
          Selection of Premium Gear
        </motion.h2>
 
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-10 max-w-2xl mx-auto text-base md:text-lg opacity-70 dark:opacity-80"
        >
          Crafted essentials designed for performance, comfort,
          and timeless style — built for modern living.
        </motion.p>
 
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="mt-14"
        >
          <button
            onClick={() => navigate("/products")}
            className="
              px-14 py-4 rounded-full text-sm tracking-widest uppercase
              border border-black dark:border-white
              text-black dark:text-white
              hover:bg-black hover:text-white
              dark:hover:bg-white dark:hover:text-black
              transition-all duration-300
            "
          >
            Shop Now
          </button>
        </motion.div>

      </div>
    </section>
  );
};

export default BannerSection;
