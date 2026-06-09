import { useEffect, useState } from "react";
import api from "../../utils/api";
import { 
  Package, 
  ShoppingBag, 
  DollarSign, 
  CheckCircle, 
  AlertCircle, 
  Hourglass,
  Store
} from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await api.get("/retailer/dashboard");
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard stats.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-neutral-950 text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-neutral-950 text-white p-6">
        <AlertCircle className="text-red-500 mb-4" size={48} />
        <p className="text-lg font-medium">{error}</p>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Revenue",
      value: `₹${stats?.totalSales?.toLocaleString("en-IN") || 0}`,
      desc: "Gross revenue from all sales",
      icon: DollarSign,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
    },
    {
      title: "Store Orders",
      value: stats?.totalOrders || 0,
      desc: "Unique client orders placed",
      icon: ShoppingBag,
      color: "text-blue-400 bg-blue-500/10 border-blue-500/20"
    },
    {
      title: "Approved Listings",
      value: stats?.approvedProducts || 0,
      desc: "Products visible to customers",
      icon: CheckCircle,
      color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20"
    },
    {
      title: "Pending Approval",
      value: stats?.pendingProducts || 0,
      desc: "Products awaiting admin verification",
      icon: Hourglass,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20"
    }
  ];

  return (
    <div className="space-y-8 pb-12 bg-neutral-950 text-white">
      {/* Header */}
      <div className="flex items-center gap-4 bg-neutral-900 border border-white/5 p-6 rounded-3xl">
        <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
          <Store size={22} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Welcome, {stats?.shopName || "Store Owner"}!</h1>
          <p className="text-xs text-neutral-400 mt-1">Here is a summary of your e-commerce listings and sales metrics.</p>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div 
              key={i} 
              className="bg-neutral-900 border border-white/5 rounded-2xl p-6 flex flex-col justify-between hover:border-white/10 transition duration-200"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">{card.title}</span>
                <div className={`p-2.5 rounded-xl border ${card.color}`}>
                  <Icon size={18} />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold text-white">{card.value}</h3>
                <p className="text-[10px] text-neutral-500 mt-1.5">{card.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Extra detailed metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Catalog Statuses */}
        <div className="bg-neutral-900 border border-white/5 p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400">Product Status Breakdown</h3>
          <div className="space-y-3.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-400">Approved Products</span>
              <span className="font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">{stats?.approvedProducts}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-400">Awaiting Verification</span>
              <span className="font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">{stats?.pendingProducts}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-400">Rejected / Fix Needed</span>
              <span className="font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full">{stats?.rejectedProducts}</span>
            </div>
            <div className="pt-2.5 border-t border-white/5 flex items-center justify-between text-xs font-bold">
              <span>Total Catalog Listings</span>
              <span>{stats?.totalProducts}</span>
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-neutral-900 border border-white/5 p-6 rounded-2xl flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400">Store Quality Tips</h3>
            <ul className="text-xs text-neutral-400 space-y-2 list-disc list-inside">
              <li>Add high-quality product images to increase sales conversion.</li>
              <li>Provide detailed product specifications to reduce customer return requests.</li>
              <li>Review the status of pending items. Contact admin if a verification stays pending for more than 48 hours.</li>
            </ul>
          </div>
          <div className="pt-6 text-[10px] text-neutral-500 italic">
            Annesie Quality Standard Framework.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
