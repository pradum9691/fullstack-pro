import { useNavigate } from "react-router-dom";

const categories = [
  {
    title: "MEN",
    subtitle: "Menswear Collection",
    bg: "bg-neutral-100",
    image: "https://pngimg.com/uploads/jacket/jacket_PNG8056.png",
  },
  {
    title: "WOMEN",
    subtitle: "Women’s Fashion",
    bg: "bg-pink-100",
    image: "https://pngimg.com/uploads/dress/dress_PNG166.png",
  },
  {
    title: "KIDS",
    subtitle: "Kids Collection",
    bg: "bg-yellow-100",
    image: "https://pngimg.com/uploads/tshirt/tshirt_PNG5454.png",
  },
];

const CategorySection = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-white dark:bg-black pt-12 md:pt-16 pb-20">
      <div className="max-w-7xl mx-auto px-6">
 
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">

          {categories.map((cat) => (
            <div
              key={cat.title}
              onClick={() =>
                navigate(`/products?category=${cat.title.toLowerCase()}`)
              }
              className={`
                ${cat.bg}
                rounded-3xl
                h-[360px] md:h-[420px]
                p-10
                flex flex-col justify-between
                cursor-pointer
                hover:scale-[1.02]
                transition-transform duration-300
              `}
            >
 
              <div>
                <p className="text-sm opacity-70">
                  {cat.subtitle}
                </p>
                <h3 className="mt-2 text-4xl font-bold tracking-wide">
                  {cat.title}
                </h3>
              </div>
 
              <div className="flex justify-center">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="h-44 md:h-52 object-contain"
                />
              </div>
 
              <div>
                <button className="inline-flex items-center gap-2 text-sm font-medium bg-black text-white px-6 py-2 rounded-full">
                  Shop Now →
                </button>
              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default CategorySection;
