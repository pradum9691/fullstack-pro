import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWishlist,
  toggleWishlist,
} from "../../store/slices/wishlistSlice";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";

const Wishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const { items, loading } = useSelector((state) => state.wishlist);

  useEffect(() => {
    if (user) dispatch(fetchWishlist());
  }, [user]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center opacity-60">
        Loading...
      </div>
    );

  if (!items.length)
    return (
      <div className="min-h-screen flex items-center justify-center opacity-60">
        Wishlist empty
      </div>
    );

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors">
      <div className="pt-24 pb-10 text-center">
        <h1 className="text-3xl font-semibold">Your Wishlist</h1>
        <p className="mt-2 text-sm opacity-60">Saved products</p>
      </div>
 
      <div className="max-w-7xl mx-auto px-6 pb-24 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
        {items.map((p) => (
          <div
            key={p._id}
            className="rounded-2xl overflow-hidden border border-black/10 dark:border-white/10"
          >
 
            <div className="relative">
              <img
                src={p.images?.[0]}
                onClick={() => navigate(`/product/${p._id}`)}
                className="h-56 w-full object-cover cursor-pointer"
              />

              <button
                onClick={() => dispatch(toggleWishlist(p._id))}
                className="absolute top-3 right-3 p-2 rounded-full
                  bg-white/80 dark:bg-black/80 hover:scale-110 transition"
              >
                <Heart size={18} className="fill-red-500 text-red-500" />
              </button>
            </div>

 
            <div className="p-4">
              <h3 className="text-sm font-medium truncate">{p.name}</h3>
              <p className="text-sm mt-1 font-semibold">₹ {p.price}</p>

              <button
                onClick={() => navigate(`/product/${p._id}`)}
                className="mt-4 w-full py-2 text-sm rounded-md
                  border border-black dark:border-white
                  hover:bg-black hover:text-white
                  dark:hover:bg-white dark:hover:text-black
                  transition"
              >
                View Product
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
