import { motion } from "framer-motion";

const HeroSection = ({ onShop }) => {
  return (
    <section className="relative min-h-[88vh] flex items-center overflow-hidden">
 
      <div className="absolute inset-0">
 
        <div className="dark:hidden absolute inset-0">
 
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, #000000 0%, #2b2b2b 50%, #f5f5f5 100%)",
            }}
          />
 
          <div
            className="
              absolute right-[-18%] top-1/2 -translate-y-1/2
              w-[650px] h-[650px]
              rounded-full
              bg-black/25
              blur-[180px]
            "
          />
        </div>
 
        <div className="hidden dark:block absolute inset-0">

          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, #f5f5f5 0%, #2b2b2b 50%, #000000 100%)",
            }}
          />
 
          <div
            className="
              absolute left-[-18%] top-1/2 -translate-y-1/2
              w-[650px] h-[650px]
              rounded-full
              bg-white/25
              blur-[180px]
            "
          />

          <div className="absolute inset-0 bg-black/35" />
        </div>
      </div>
 
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="max-w-xl">

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="
              text-4xl sm:text-5xl md:text-6xl lg:text-7xl
              font-semibold leading-tight
              text-white dark:text-white
            "
          >
            Timeless Style,
            <br />
            Everyday Comfort
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mt-8 text-base md:text-lg text-white/80"
          >
            Crafted essentials designed for modern living.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="mt-12"
          >
            <button
              onClick={onShop}
              className="
                px-10 py-3 rounded-full
                text-sm tracking-widest uppercase
                bg-white text-black
                hover:bg-black hover:text-white
                transition-all duration-300
              "
            >
              Shop Collection
            </button>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;