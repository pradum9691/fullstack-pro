import { Truck, ShieldCheck, RefreshCcw, Award } from "lucide-react";

const features = [
  {
    title: "Free Delivery",
    desc: "Fast & reliable shipping",
    icon: Truck,
  },
  {
    title: "Secure Payment",
    desc: "100% safe transactions",
    icon: ShieldCheck,
  },
  {
    title: "Easy Returns",
    desc: "7-day return policy",
    icon: RefreshCcw,
  },
  {
    title: "Premium Quality",
    desc: "Best in class products",
    icon: Award,
  },
];

const TrustSection = () => {
  return (
    <section
      className="
        py-10 md:py-12
        bg-white text-black
        dark:bg-black dark:text-white
        border-t border-black/10 dark:border-white/10
      "
    >
      <div className="max-w-7xl mx-auto px-6">

        <div
          className="
            grid grid-cols-2 sm:grid-cols-4
            gap-x-8 gap-y-12
            text-center
          "
        >
          {features.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="
                  flex flex-col items-center
                  gap-3
                "
              >
     
                <div
                  className="
                    h-10 w-10
                    flex items-center justify-center
                    rounded-full
                    border border-black/20 dark:border-white/20
                  "
                >
                  <Icon size={18} className="opacity-80" />
                </div>

           
                <h3 className="font-medium text-sm">
                  {item.title}
                </h3>

                <p className="text-xs opacity-70 dark:opacity-80">
                  {item.desc}
                </p>
              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
};

export default TrustSection;