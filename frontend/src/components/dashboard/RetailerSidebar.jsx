import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutSuccess } from "../../store/slices/authSlice";
import { clearWishlist } from "../../store/slices/wishlistSlice";
import { useCart } from "../../context/CartContext";
import { toast } from "react-toastify";
import { 
  LayoutDashboard, 
  Package, 
  PlusCircle, 
  ShoppingBag, 
  LogOut, 
  X,
  ClipboardList
} from "lucide-react";

const RetailerSidebar = ({ close }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  const { clearCart } = useCart();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    dispatch(logoutSuccess());
    dispatch(clearWishlist());
    clearCart();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const menuItems = [
    { name: "Dashboard", path: "/retailer/dashboard", icon: LayoutDashboard },
    { name: "My Products", path: "/retailer/products", icon: Package },
    { name: "Add Product", path: "/retailer/products/add", icon: PlusCircle },
    { name: "My Orders", path: "/retailer/orders", icon: ClipboardList },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="h-full flex flex-col justify-between bg-black text-white p-6 border-r border-white/10 select-none">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-[0.2em] uppercase text-white">
              Annesie Retailer
            </span>
            <span className="text-[10px] text-neutral-500 tracking-wider">
              Store Manager
            </span>
          </div>
          {close && (
            <button 
              onClick={close} 
              className="lg:hidden text-neutral-400 hover:text-white p-1"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={close}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-white text-black font-semibold shadow-lg shadow-white/5"
                    : "text-neutral-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Info & Actions */}
      <div className="space-y-4 pt-6 border-t border-white/10">
        {/* Back to Shop */}
        <Link
          to="/"
          onClick={close}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-neutral-400 hover:text-white hover:bg-white/5 transition-all duration-200"
        >
          <ShoppingBag size={18} />
          <span>Go to Shop</span>
        </Link>

        {/* User Profile */}
        <div className="flex items-center gap-3 px-2">
          <div className="h-9 w-9 rounded-full bg-neutral-800 flex items-center justify-center font-bold text-sm text-white border border-white/10">
            {user?.name ? user.name[0].toUpperCase() : "R"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate text-white">{user?.name || "Retailer"}</p>
            <p className="text-[10px] text-neutral-500 truncate">{user?.email || "retailer@ecom.com"}</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 text-left"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default RetailerSidebar;
