import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { useCart } from "../../context/CartContext";
import { fetchWishlist, toggleWishlist } from "../../store/slices/wishlistSlice";
import { useDispatch, useSelector } from "react-redux";
import { Heart } from "lucide-react";

const categories = ["All", "Men", "Women", "Unisex"];
const RECENT_KEY = "recent_products";

const SkeletonCard = () => (
  <div className="rounded-2xl overflow-hidden border border-black/10 dark:border-white/10">
    <div className="h-60 bg-black/10 dark:bg-white/10 animate-pulse" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-black/10 dark:bg-white/10 rounded animate-pulse" />
      <div className="h-4 w-1/2 bg-black/10 dark:bg-white/10 rounded animate-pulse" />
      <div className="grid grid-cols-2 gap-2 mt-4">
        <div className="h-8 bg-black/10 dark:bg-white/10 rounded animate-pulse" />
        <div className="h-8 bg-black/10 dark:bg-white/10 rounded animate-pulse" />
      </div>
    </div>
  </div>
);

const Products = () => {
  const [products, setProducts] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist.items);
  const wishlistLoading = useSelector((state) => state.wishlist.loading);
  const user = useSelector((state) => state.auth.user);
 
  const isWishlisted = (id) =>
    wishlist.some(
      (item) =>
        item?._id?.toString() === id || item?.toString?.() === id
    );

  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart, buyNow } = useCart();

  const category = params.get("category") || "All";
  const search = params.get("search") || "";
  const sort = params.get("sort") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await api.get("/products", {
          params: {
            category: category !== "All" ? category : undefined,
            search: search || undefined,
            sort: sort || undefined,
          },
        });
        setProducts(res.data.data || []);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category, search, sort]);

  useEffect(() => {
    if (user) dispatch(fetchWishlist());
  }, [user, dispatch]);

  const userKey = user ? `recent_products_${user._id}` : "recent_products_guest";

  useEffect(() => {
    const ids = JSON.parse(localStorage.getItem(userKey)) || [];
    if (!ids.length) {
      setRecentProducts([]);
      return;
    }

    api.get("/products", { params: { ids: ids.join(",") } })
      .then((res) => setRecentProducts(res.data.data || []))
      .catch(() => {});
  }, [userKey]);

  const saveRecent = (id) => {
    let list = JSON.parse(localStorage.getItem(userKey)) || [];
    list = list.filter((x) => x !== id);
    list.unshift(id);
    localStorage.setItem(userKey, JSON.stringify(list.slice(0, 6)));
  };


  const updateParam = (key, value) => {
    const p = new URLSearchParams(params);
    value ? p.set(key, value) : p.delete(key);
    setParams(p);
  };

  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white transition-colors">
 
      <div className="pt-20 pb-10 text-center">
        <h1 className="text-4xl font-semibold">Shop All</h1>
        <p className="mt-3 text-sm opacity-60">Everyday essentials</p>
      </div>
 
      <div className="max-w-7xl mx-auto px-6 mb-8 flex flex-wrap gap-4 items-center">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => updateParam("category", c === "All" ? "" : c)}
            className={`px-4 py-2 text-sm rounded-full border transition ${
              category === c
                ? "bg-black text-white dark:bg-white dark:text-black"
                : "border-black/20 dark:border-white/20 opacity-70"
            }`}
          >
            {c}
          </button>
        ))}

        <input
          placeholder="Search"
          value={search}
          onChange={(e) => updateParam("search", e.target.value)}
          className="px-3 py-2 text-sm rounded-md border border-black/20 dark:border-white/20 bg-transparent outline-none"
        />

        <select
          value={sort}
          onChange={(e) => updateParam("sort", e.target.value)}
          className="px-3 py-2 text-sm rounded-md border border-black/20 dark:border-white/20 bg-transparent outline-none"
        >
          <option value="">Sort</option>
          <option value="price_asc">Price ↑</option>
          <option value="price_desc">Price ↓</option>
        </select>
      </div>
 
      <div className="max-w-7xl mx-auto px-6 pb-24">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 opacity-60">No products found</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((p) => (
              <div
                key={p._id}
                className="rounded-2xl overflow-hidden border border-black/10 dark:border-white/10"
              >
                <div className="relative">
                  <img
                    src={p.images?.[0]}
                    onClick={() => {
                      saveRecent(p._id);
                      navigate(`/product/${p._id}`);
                    }}
                    className="h-60 w-full object-cover cursor-pointer"
                  />

         
                  <button
                    disabled={wishlistLoading}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!user) return navigate("/login");
                      dispatch(toggleWishlist(p._id));
                    }}
                    className={`absolute top-3 right-3 p-2 rounded-full
                      bg-white/80 dark:bg-black/80 hover:scale-110 transition
                      ${wishlistLoading ? "opacity-50 pointer-events-none" : ""}
                    `}
                  >
                    <Heart
                      size={18}
                      className={
                        isWishlisted(p._id)
                          ? "fill-red-500 text-red-500"
                          : "text-black dark:text-white"
                      }
                    />
                  </button>
                </div>

                <div className="p-4">
                  <h3 className="text-sm font-medium truncate">{p.name}</h3>
                  <p className="text-sm mt-1 font-semibold">₹ {p.price}</p>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => addToCart(p._id, 1)}
                      className="py-2 text-sm rounded-md border border-black dark:border-white"
                    >
                      Add to Cart
                    </button>

                    <button
                      onClick={async () => {
                        try {
                          await buyNow(p._id, 1);
                          navigate("/checkout");
                        } catch {
                          navigate("/login");
                        }
                      }}
                      className="py-2 text-sm rounded-md bg-black text-white dark:bg-white dark:text-black"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {recentProducts.length > 0 && (
          <div className="mt-24">
            <h2 className="text-2xl font-semibold mb-6">Recently Viewed</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {recentProducts.map((p) => (
                <div
                  key={p._id}
                  onClick={() => navigate(`/product/${p._id}`)}
                  className="cursor-pointer border border-black/10 dark:border-white/10 p-3 rounded-xl"
                >
                  <img
                    src={p.images?.[0]}
                    className="h-40 w-full object-cover rounded-lg"
                  />
                  <p className="mt-2 text-sm truncate">{p.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
