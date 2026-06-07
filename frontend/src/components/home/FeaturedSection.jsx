import { useNavigate } from "react-router-dom";
import { products } from "../../data/products";

const FeaturedSection = () => {
  const navigate = useNavigate();
  const featured = products.slice(0, 4);

  return (
    <section className="
      py-16 sm:py-20 lg:py-24
      bg-white text-black
      dark:bg-black dark:text-white
      transition-colors
    ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 
        <h2 className="
          text-3xl sm:text-4xl lg:text-5xl
          font-semibold text-center
          mb-10 sm:mb-14
        ">
          Trending Products
        </h2>
 
        <div className="
          grid grid-cols-2
          sm:grid-cols-3
          lg:grid-cols-4
          gap-6 sm:gap-8
        ">
          {featured.map((p) => (
            <div
              key={p.id}
              onClick={() => navigate("/products")}
              className="
                group cursor-pointer
                rounded-2xl sm:rounded-3xl
                border border-black/10 dark:border-white/10
                bg-white dark:bg-black
                overflow-hidden
                transition-all duration-300 ease-out
                hover:-translate-y-2
                hover:shadow-xl
                active:scale-[0.97]
              "
            >

          
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={p.image}
                  loading="lazy"
                  alt={p.name}
                  className="
                    absolute inset-0
                    h-full w-full object-cover
                    transition-transform duration-500
                    group-hover:scale-110
                  "
                />
 
                <div className="
                  absolute inset-0
                  bg-gradient-to-t
                  from-black/20 via-transparent to-transparent
                  opacity-0 group-hover:opacity-100
                  transition-opacity
                " />
              </div>

      
              <div className="p-4 sm:p-5">
                <h3 className="
                  font-medium text-sm sm:text-base
                  truncate
                ">
                  {p.name}
                </h3>

                <p className="
                  mt-1 text-sm
                  opacity-70 dark:opacity-80
                ">
                  ₹ {p.price}
                </p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FeaturedSection;