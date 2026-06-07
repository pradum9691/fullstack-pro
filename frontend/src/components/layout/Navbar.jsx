import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { logoutSuccess } from "../../store/slices/authSlice";
import { useCart } from "../../context/CartContext";
import { useDispatch, useSelector } from "react-redux";
import { Sun, Moon, Menu, X, Search, Heart } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { clearWishlist } from "../../store/slices/wishlistSlice";
import { toast } from "react-toastify";

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const wishlist = useSelector((state) => state.wishlist.items || []);
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");

  const { totalItems } = useCart();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    dispatch(logoutSuccess());
    dispatch(clearWishlist());
    clearCart();
    toast.success("Logged out");
    navigate("/login");
  };
  useEffect(() => {
    setMobileOpen(false);
    setShowSearch(false);
  }, [location.pathname]);

  useEffect(() => {
    const close = (e) => e.key === "Escape" && setShowSearch(false);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/")
      ? "opacity-100 underline underline-offset-4"
      : "opacity-60 hover:opacity-100";
  const menuItems = [
    { name: "Shop All", path: "/products" },
    user && { name: "Orders", path: "/orders" },
    user && { name: "Profile", path: "/profile" },
    { name: "Contact", path: "/contact" },
  ].filter(Boolean);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/products?search=${query}`);
    setQuery("");
    setShowSearch(false);
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-[60] bg-black text-white text-[10px] tracking-widest overflow-hidden">
        <div className="marquee">
          <div className="marquee__inner">
            <span>FREE SHIPPING WORLDWIDE</span>
            <span>PREMIUM QUALITY</span>
            <span>FREE SHIPPING WORLDWIDE</span>
            <span>PREMIUM QUALITY</span>
          </div>
          <div className="marquee__inner">
            <span>FREE SHIPPING WORLDWIDE</span>
            <span>PREMIUM QUALITY</span>
            <span>FREE SHIPPING WORLDWIDE</span>
            <span>PREMIUM QUALITY</span>
          </div>
          <div className="marquee__inner">
            <span>FREE SHIPPING WORLDWIDE</span>
            <span>PREMIUM QUALITY</span>
            <span>FREE SHIPPING WORLDWIDE</span>
            <span>PREMIUM QUALITY</span>
          </div>
        </div>
      </div>

      <header className="fixed top-7 left-0 right-0 z-[50]">
        <div className="max-w-7xl mx-auto px-5">
          <div
            className="
              h-14 flex items-center justify-between rounded-full px-6
              backdrop-blur-xl transition-colors duration-300
              bg-white/80 text-black
              dark:bg-black/80 dark:text-white
              border border-black/10 dark:border-white/10
            "
          >
            <nav className="hidden md:flex gap-7 text-xs font-medium">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={isActive(item.path)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <Link
              to="/"
              className="text-xs md:text-sm font-semibold tracking-[0.35em] uppercase"
            >
              Annesie Whites
            </Link>

            <div className="flex items-center gap-4 text-xs">
              <button
                onClick={() => navigate("/wishlist")}
                className="relative opacity-70 hover:opacity-100"
              >
                <Heart size={15} />

                {wishlist.length > 0 && (
                  <span
                    className="absolute -top-2 -right-2 text-[10px] px-1.5 rounded-full bg-red-500 text-white" >
                    {wishlist.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="opacity-70 hover:opacity-100"
              >
                <Search size={15} />
              </button>

              <button
                onClick={toggleTheme}
                className="opacity-70 hover:opacity-100"
              >
                {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
              </button>

              <button
                onClick={() => navigate("/cart")}
                className="relative opacity-70 hover:opacity-100"
              >
                Cart
                {totalItems > 0 && (
                  <span
                    className="
    absolute -top-2 -right-3 text-[10px] px-1.5 rounded-full
    bg-black text-white dark:bg-white dark:text-black
  "
                  >
                    {totalItems}
                  </span>
                )}
              </button>

              {user ? (
                <button
                  onClick={handleLogout}
                  className="opacity-70 hover:opacity-100"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="opacity-70 hover:opacity-100"
                >
                  Login
                </button>
              )}

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden opacity-70"
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
 
          {showSearch && (
            <form
              onSubmit={handleSearch}
              className="
                absolute left-4 right-4 top-full mt-3
                bg-white dark:bg-black
                border border-black/10 dark:border-white/10
                rounded-full px-5 py-3 shadow-xl
              "
            >
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-transparent outline-none text-sm"
                autoFocus
              />
            </form>
          )}
 
          {mobileOpen && (
            <div
              className="
                md:hidden mt-3 mx-3
                bg-white dark:bg-black
                border border-black/10 dark:border-white/10
                rounded-2xl px-6 py-6
              "
            >
              <div className="flex flex-col gap-4 text-sm">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={isActive(item.path)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Navbar;
