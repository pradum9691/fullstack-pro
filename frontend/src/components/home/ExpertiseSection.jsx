import { motion } from "framer-motion";

const ExpertiseSection = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[75vh] lg:min-h-[90vh]">

        {/* LEFT CONTENT */}
        <div
          className="
            flex items-center
            bg-black text-white
            dark:bg-white dark:text-black
            transition-colors
          "
        >
          <div
            className="
              max-w-xl
              px-6 sm:px-10 lg:px-14
              py-16 sm:py-20 lg:py-28
            "
          >
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="
                block mb-6
                text-xs sm:text-sm
                tracking-[0.35em]
                uppercase opacity-60
              "
            >
              Our Expertise
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="
                text-4xl sm:text-5xl lg:text-6xl
                font-semibold leading-tight
              "
            >
              Where Design
              <br />
              Meets Precision
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="
                mt-8 sm:mt-10
                text-base sm:text-lg
                opacity-70
              "
            >
              Our process blends innovation with craftsmanship.
              Every detail is carefully refined — from material
              selection to final execution — ensuring products
              that feel purposeful and enduring.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="
                mt-6
                text-base sm:text-lg
                opacity-70
              "
            >
              This is where modern engineering meets timeless
              aesthetics — crafted to elevate everyday living.
            </motion.p>
          </div>
        </div>

        {/* RIGHT IMAGE – FIXED (NO CUT) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="
            relative
            flex items-center justify-center
            bg-black dark:bg-white
          "
        >
          <img
            src="https://images.unsplash.com/photo-1632450017961-ce82a195ee25?q=80&w=1600&auto=format&fit=crop"
            alt="Expertise"
            className="
              max-w-full
              max-h-full
              object-contain
            "
          />
        </motion.div>
      </div>
    </section>
  );
};

export default ExpertiseSection;
