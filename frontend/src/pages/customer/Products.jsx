import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { useCart } from "../../context/CartContext";
import { fetchWishlist, toggleWishlist } from "../../store/slices/wishlistSlice";
import { useDispatch, useSelector } from "react-redux";
import { Heart, Search, SlidersHorizontal, ShoppingBag, Zap, X, Clock, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const categories = ["All", "Men", "Women", "Unisex"];

const SkeletonCard = ({ index }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: index * 0.05 }}
    className="rounded-2xl overflow-hidden bg-[#111] border border-white/[0.06]"
  >
    <div className="h-64 shimmer" />
    <div className="p-4 space-y-3">
      <div className="h-3 w-3/4 shimmer rounded-lg" />
      <div className="h-3 w-1/3 shimmer rounded-lg" />
      <div className="grid grid-cols-2 gap-2 mt-4">
        <div className="h-9 shimmer rounded-xl" />
        <div className="h-9 shimmer rounded-xl" />
      </div>
    </div>
  </motion.div>
);

const ProductCard = ({ p, isWishlisted, wishlistLoading, onWishlist, onNavigate, onAddToCart, onBuyNow, index }) => {
  const [hovered, setHovered] = useState(false);
  const [adding, setAdding] = useState(false);
  const [buying, setBuying] = useState(false);

  const handleAdd = async (e) => {
    e.stopPropagation();
    setAdding(true);
    await onAddToCart(p._id, 1);
    setTimeout(() => setAdding(false), 800);
  };

  const handleBuy = async (e) => {
    e.stopPropagation();
    setBuying(true);
    await onBuyNow(p._id, 1);
    setBuying(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      <div className="relative bg-[#111] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-white/[0.12] transition-all duration-300 group-hover:-translate-y-1">
        {/* Image */}
        <div
          className="relative h-64 overflow-hidden cursor-pointer bg-[#0d0d0d]"
          onClick={() => onNavigate(p._id)}
        >
          {p.images?.[0] ? (
            <img
              src={p.images[0]}
              alt={p.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-white/15">
              <Package size={32} className="mb-2" />
              <span className="text-xs">No Image</span>
            </div>
          )}

          {/* Category badge */}
          <span className="absolute top-3 left-3 badge badge-neutral text-white/40">
            {p.category}
          </span>

          {/* Wishlist */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={wishlistLoading}
            onClick={(e) => {
              e.stopPropagation();
              onWishlist(p._id);
            }}
            className={`absolute top-3 right-3 h-8 w-8 flex items-center justify-center rounded-xl backdrop-blur-xl border transition-all duration-200 ${
              isWishlisted
                ? "bg-rose-500/20 border-rose-500/30 text-rose-400"
                : "bg-black/40 border-white/10 text-white/40 hover:text-white hover:border-white/20"
            } ${wishlistLoading ? "opacity-50 pointer-events-none" : ""}`}
          >
            <Heart size={14} className={isWishlisted ? "fill-rose-500 text-rose-500" : ""} />
          </motion.button>

          {/* Quick buy overlay */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent"
              >
                <button
                  onClick={handleAdd}
                  disabled={adding}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold hover:bg-white/20 transition-all duration-200"
                >
                  <ShoppingBag size={12} />
                  {adding ? "Added!" : "Quick Add"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3
            className="text-sm font-medium text-white/80 truncate cursor-pointer hover:text-white transition-colors"
            onClick={() => onNavigate(p._id)}
          >
            {p.name}
          </h3>
          <div className="flex items-center justify-between mt-2">
            <p className="text-base font-bold text-white">₹{p.price?.toLocaleString("en-IN")}</p>
            {p.stock < 5 && p.stock > 0 && (
              <span className="badge badge-amber">Only {p.stock} left</span>
            )}
            {p.stock === 0 && (
              <span className="badge badge-rose">Out of stock</span>
            )}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              onClick={handleAdd}
              disabled={adding || p.stock === 0}
              className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ShoppingBag size={12} />
              {adding ? "Added!" : "Cart"}
            </button>
            <button
              onClick={handleBuy}
              disabled={buying || p.stock === 0}
              className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-xl bg-white text-black hover:bg-white/90 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Zap size={12} />
              {buying ? "..." : "Buy Now"}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist.items);
  const wishlistLoading = useSelector((state) => state.wishlist.loading);
  const user = useSelector((state) => state.auth.user);

  const isWishlisted = (id) =>
    wishlist.some((item) =>
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
    if (!ids.length) { setRecentProducts([]); return; }
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

  const handleNavigate = (id) => {
    saveRecent(id);
    navigate(`/product/${id}`);
  };

  const updateParam = (key, value) => {
    const p = new URLSearchParams(params);
    value ? p.set(key, value) : p.delete(key);
    setParams(p);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-20">
      {/* Page Header */}
      <div className="relative overflow-hidden border-b border-white/[0.05] py-16">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/25 mb-3">Collection</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">Shop All</h1>
            <p className="mt-3 text-sm text-white/30 font-light">
              {loading ? "Loading..." : `${products.length} products found`}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => updateParam("category", c === "All" ? "" : c)}
                className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all duration-200 ${
                  category === c
                    ? "bg-white text-black border-white"
                    : "bg-white/[0.03] border-white/[0.08] text-white/40 hover:text-white hover:border-white/20"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Search & Sort */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
              <input
                placeholder="Search products..."
                value={search}
                onChange={(e) => updateParam("search", e.target.value)}
                className="pl-9 pr-8 py-2.5 text-xs font-medium rounded-xl border border-white/[0.08] bg-white/[0.03] text-white placeholder-white/25 outline-none focus:border-white/20 transition-colors w-44 sm:w-56"
              />
              {search && (
                <button
                  onClick={() => updateParam("search", "")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            <div className="relative">
              <SlidersHorizontal size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
              <select
                value={sort}
                onChange={(e) => updateParam("sort", e.target.value)}
                className="pl-8 pr-3 py-2.5 text-xs font-medium rounded-xl border border-white/[0.08] bg-[#111] text-white/50 outline-none focus:border-white/20 transition-colors appearance-none"
              >
                <option value="">Sort by</option>
                <option value="price_asc">Price: Low → High</option>
                <option value="price_desc">Price: High → Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} index={i} />)}
          </div>
        ) : products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-32 flex flex-col items-center gap-4"
          >
            <div className="h-16 w-16 rounded-2xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center">
              <Package size={24} className="text-white/20" />
            </div>
            <p className="text-white/30 font-medium">No products found</p>
            <button
              onClick={() => { updateParam("search", ""); updateParam("category", ""); }}
              className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Clear filters
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((p, i) => (
              <ProductCard
                key={p._id}
                p={p}
                index={i}
                isWishlisted={isWishlisted(p._id)}
                wishlistLoading={wishlistLoading}
                onWishlist={(id) => {
                  if (!user) return navigate("/login");
                  dispatch(toggleWishlist(id));
                }}
                onNavigate={handleNavigate}
                onAddToCart={addToCart}
                onBuyNow={async (id, qty) => {
                  try {
                    await buyNow(id, qty);
                    navigate("/checkout");
                  } catch {
                    navigate("/login");
                  }
                }}
              />
            ))}
          </div>
        )}

        {/* Recently Viewed */}
        {recentProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-24 pt-12 border-t border-white/[0.05]"
          >
            <div className="flex items-center gap-2 mb-8">
              <Clock size={14} className="text-white/25" />
              <h2 className="text-sm font-bold uppercase tracking-widest text-white/30">Recently Viewed</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
              {recentProducts.slice(0, 4).map((p, i) => (
                <motion.div
                  key={p._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  onClick={() => handleNavigate(p._id)}
                  className="cursor-pointer group bg-[#111] border border-white/[0.06] rounded-xl overflow-hidden hover:border-white/[0.12] transition-all duration-200 hover:-translate-y-0.5"
                >
                  {p.images?.[0] ? (
                    <img src={p.images[0]} alt={p.name} className="h-40 w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="h-40 flex items-center justify-center text-white/10"><Package size={24} /></div>
                  )}
                  <div className="p-3">
                    <p className="text-xs font-medium text-white/60 truncate">{p.name}</p>
                    <p className="text-xs font-bold text-white mt-1">₹{p.price?.toLocaleString("en-IN")}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Products;
