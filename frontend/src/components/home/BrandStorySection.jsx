import { motion } from "framer-motion";

const BrandStorySection = () => {
  return (
    <section className="
      relative py-24 md:py-28
      bg-white text-black
      dark:bg-black dark:text-white
      transition-colors
    ">
      <div className="max-w-7xl mx-auto px-6">

        <div className="
          grid grid-cols-1 lg:grid-cols-2
          gap-14 md:gap-16 items-center
        ">
 
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative h-[520px] lg:h-[620px] overflow-hidden rounded-3xl"
          >
            <img
              src="https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1600&auto=format&fit=crop"
              alt="Brand Story"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </motion.div>
 
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="
              block mb-6
              text-sm tracking-[0.35em] uppercase
              opacity-60
            ">
              Our Story
            </span>

            <h2 className="
              text-4xl sm:text-5xl lg:text-6xl
              font-semibold leading-tight
            ">
              Designed with Purpose, <br />
              Crafted for Everyday Life
            </h2>

            <p className="
              mt-10 max-w-xl
              text-base md:text-lg
              opacity-70 dark:opacity-80
            ">
              We believe great design should feel effortless.
              Every piece is created with a focus on quality,
              balance, and timeless appeal — made to move with you,
              not against you.
            </p>

            <p className="
              mt-6 max-w-xl
              text-base md:text-lg
              opacity-70 dark:opacity-80
            ">
              From materials to form, every detail is refined
              to deliver comfort, durability, and quiet confidence
              you can feel every day.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default BrandStorySection;
