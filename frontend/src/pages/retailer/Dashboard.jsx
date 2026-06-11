import { useEffect, useState } from "react";
import api from "../../utils/api";
import { motion } from "framer-motion";
import { 
  Package, 
  ShoppingBag, 
  DollarSign, 
  CheckCircle, 
  AlertCircle, 
  Hourglass,
  Store,
  TrendingUp
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
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="rounded-full h-10 w-10 border-t-2 border-emerald-500"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-neutral-950 text-white p-6">
        <AlertCircle className="text-rose-500 mb-4" size={48} />
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
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      gradient: "from-emerald-500/10 to-teal-500/10"
    },
    {
      title: "Store Orders",
      value: stats?.totalOrders || 0,
      desc: "Unique client orders placed",
      icon: ShoppingBag,
      color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
      gradient: "from-blue-500/10 to-cyan-500/10"
    },
    {
      title: "Approved Listings",
      value: stats?.approvedProducts || 0,
      desc: "Products visible to customers",
      icon: CheckCircle,
      color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
      gradient: "from-indigo-500/10 to-purple-500/10"
    },
    {
      title: "Pending Approval",
      value: stats?.pendingProducts || 0,
      desc: "Products awaiting admin verification",
      icon: Hourglass,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      gradient: "from-amber-500/10 to-orange-500/10"
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="space-y-8 pb-12 bg-neutral-950 text-white min-h-full">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden flex items-center gap-6 bg-gradient-to-r from-neutral-900 to-neutral-950 border border-white/10 p-8 rounded-[2rem]"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Store size={28} className="text-white" />
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white tracking-tight">Welcome back, {stats?.shopName || "Store Owner"}!</h1>
          <p className="text-sm text-neutral-400 mt-1 flex items-center gap-2">
            <TrendingUp size={14} className="text-emerald-400" />
            Here is a summary of your store's performance.
          </p>
        </div>
      </motion.div>

      {/* Stats Cards Grid */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div 
              variants={item}
              key={i} 
              className="relative group"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${card.gradient} rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="relative bg-neutral-900 border border-white/5 rounded-[2rem] p-6 flex flex-col justify-between hover:border-white/10 transition-all duration-300 h-full">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest">{card.title}</span>
                  <div className={`p-3 rounded-2xl border ${card.color}`}>
                    <Icon size={20} />
                  </div>
                </div>
                <div className="mt-6">
                  <h3 className="text-4xl font-bold text-white tracking-tight">{card.value}</h3>
                  <p className="text-xs text-neutral-500 mt-2 font-medium">{card.desc}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Extra detailed metrics */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        {/* Product Catalog Statuses */}
        <motion.div variants={item} className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-white/5 p-8 rounded-[2rem] relative overflow-hidden">
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-500/20 blur-[80px] rounded-full pointer-events-none" />
          <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-6 flex items-center gap-2">
            <Package size={16} className="text-indigo-400" /> Product Status Breakdown
          </h3>
          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-black/20 border border-white/5">
              <span className="text-sm text-neutral-300 font-medium">Approved Products</span>
              <span className="font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">{stats?.approvedProducts}</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-2xl bg-black/20 border border-white/5">
              <span className="text-sm text-neutral-300 font-medium">Awaiting Verification</span>
              <span className="font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">{stats?.pendingProducts}</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-2xl bg-black/20 border border-white/5">
              <span className="text-sm text-neutral-300 font-medium">Rejected / Fix Needed</span>
              <span className="font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-full">{stats?.rejectedProducts}</span>
            </div>
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-sm font-bold">
              <span className="text-neutral-400">Total Catalog Listings</span>
              <span className="text-xl">{stats?.totalProducts}</span>
            </div>
          </div>
        </motion.div>

        {/* Quick Tips */}
        <motion.div variants={item} className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-white/5 p-8 rounded-[2rem] flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/10 blur-[80px] rounded-full pointer-events-none" />
          <div className="space-y-6 relative z-10">
            <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-2">
              <CheckCircle size={16} className="text-amber-400" /> Store Quality Tips
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 bg-black/20 p-4 rounded-2xl border border-white/5">
                <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-emerald-400 text-xs font-bold">1</span>
                </div>
                <span className="text-sm text-neutral-300 leading-relaxed">Add high-quality product images to significantly increase your sales conversion rate.</span>
              </li>
              <li className="flex items-start gap-3 bg-black/20 p-4 rounded-2xl border border-white/5">
                <div className="h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-blue-400 text-xs font-bold">2</span>
                </div>
                <span className="text-sm text-neutral-300 leading-relaxed">Provide detailed product specifications to build trust and reduce customer return requests.</span>
              </li>
              <li className="flex items-start gap-3 bg-black/20 p-4 rounded-2xl border border-white/5">
                <div className="h-6 w-6 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-amber-400 text-xs font-bold">3</span>
                </div>
                <span className="text-sm text-neutral-300 leading-relaxed">Regularly review pending items. Contact admin if a verification stays pending for over 48 hours.</span>
              </li>
            </ul>
          </div>
          <div className="pt-8 text-xs text-neutral-600 font-medium uppercase tracking-widest relative z-10 text-center">
            Annesie Quality Standard Framework
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
