import { useEffect, useState } from "react";
import api from "../../utils/api";
import { motion } from "framer-motion";
import { 
  Users, 
  UserCheck, 
  UserX, 
  ShoppingBag, 
  DollarSign, 
  Package, 
  Clock, 
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Activity
} from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getStats = async () => {
      try {
        setLoading(true);
        const res = await api.get("/admin/dashboard");
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard metrics.");
      } finally {
        setLoading(false);
      }
    };
    getStats();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-neutral-950 text-white">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="rounded-full h-10 w-10 border-t-2 border-indigo-500"
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

  const userStats = [
    { label: "Total Users", value: stats?.totalUsers || 0, icon: Users, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { label: "Active Users", value: stats?.activeUsers || 0, icon: UserCheck, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { label: "Blocked Users", value: stats?.blockedUsers || 0, icon: UserX, color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
  ];

  const businessStats = [
    { label: "Total Revenue", value: `₹${stats?.totalSales?.toLocaleString("en-IN") || 0}`, icon: DollarSign, color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
    { label: "Total Orders", value: stats?.totalOrders || 0, icon: ShoppingBag, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
    { label: "Pending Orders", value: stats?.pendingOrders || 0, icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  ];

  const productStats = [
    { label: "Total Products", value: stats?.totalProducts || 0, icon: Package, color: "text-sky-400", bg: "bg-sky-500/10", border: "border-sky-500/20" },
    { label: "Pending Approvals", value: stats?.pendingProducts || 0, icon: Clock, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
    { label: "Approved Products", value: stats?.approvedProducts || 0, icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  ];

  const activeUserPercent = stats?.totalUsers ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0;
  const approvedProductPercent = stats?.totalProducts ? Math.round((stats.approvedProducts / stats.totalProducts) * 100) : 0;

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
    <div className="space-y-10 pb-12 bg-neutral-950 text-white min-h-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">Admin Command Center</h1>
          <p className="text-sm text-neutral-400 mt-2 flex items-center gap-2">
            <Activity size={14} className="text-indigo-400" />
            Live metrics and overview of Annesie Whites.
          </p>
        </div>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="space-y-10">
        
        {/* Financials */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4 flex items-center gap-2">
            <TrendingUp size={14} /> Financials & Sales
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {businessStats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div variants={item} key={idx} className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative bg-neutral-900 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-400 font-medium">{stat.label}</span>
                      <div className={`p-2.5 rounded-xl border ${stat.color} ${stat.bg} ${stat.border}`}>
                        <Icon size={18} />
                      </div>
                    </div>
                    <h3 className="text-4xl font-bold mt-4 tracking-tight">{stat.value}</h3>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Users */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4 flex items-center gap-2">
            <Users size={14} /> User Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {userStats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div variants={item} key={idx} className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative bg-neutral-900 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-400 font-medium">{stat.label}</span>
                      <div className={`p-2.5 rounded-xl border ${stat.color} ${stat.bg} ${stat.border}`}>
                        <Icon size={18} />
                      </div>
                    </div>
                    <h3 className="text-3xl font-bold mt-4 tracking-tight">{stat.value}</h3>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Products */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4 flex items-center gap-2">
            <Package size={14} /> Product Catalog
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {productStats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div variants={item} key={idx} className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-sky-500/10 to-emerald-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative bg-neutral-900 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-400 font-medium">{stat.label}</span>
                      <div className={`p-2.5 rounded-xl border ${stat.color} ${stat.bg} ${stat.border}`}>
                        <Icon size={18} />
                      </div>
                    </div>
                    <h3 className="text-3xl font-bold mt-4 tracking-tight">{stat.value}</h3>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Analytics Visualizer Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
          {/* User Ratio card */}
          <motion.div variants={item} className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-white/5 rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/20 blur-[80px] rounded-full pointer-events-none" />
            <h3 className="text-xl font-bold mb-6 text-white relative z-10">User Engagement Ratio</h3>
            <div className="space-y-8 relative z-10">
              <div>
                <div className="flex justify-between text-sm mb-3 font-medium">
                  <span className="text-emerald-400">Active ({activeUserPercent}%)</span>
                  <span className="text-rose-400">Blocked ({100 - activeUserPercent}%)</span>
                </div>
                <div className="h-3 w-full bg-neutral-800 rounded-full overflow-hidden shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${activeUserPercent}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10 text-center">
                <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">Customers</p>
                  <p className="text-2xl font-bold mt-2 text-white">{stats?.customers || 0}</p>
                </div>
                <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">Retailers</p>
                  <p className="text-2xl font-bold mt-2 text-white">{stats?.retailers || 0}</p>
                </div>
                <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">Admins</p>
                  <p className="text-2xl font-bold mt-2 text-white">{stats?.admins || 0}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Product approval Ratio card */}
          <motion.div variants={item} className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-white/5 rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/20 blur-[80px] rounded-full pointer-events-none" />
            <h3 className="text-xl font-bold mb-6 text-white relative z-10">Catalog Health</h3>
            <div className="space-y-8 relative z-10">
              <div>
                <div className="flex justify-between text-sm mb-3 font-medium">
                  <span className="text-emerald-400">Approved ({approvedProductPercent}%)</span>
                  <span className="text-amber-400">Pending/Rejected ({100 - approvedProductPercent}%)</span>
                </div>
                <div className="h-3 w-full bg-neutral-800 rounded-full overflow-hidden shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${approvedProductPercent}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/10 text-center">
                <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">Pending Approvals</p>
                  <p className="text-2xl font-bold mt-2 text-amber-400">{stats?.pendingProducts || 0}</p>
                </div>
                <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">Rejected Products</p>
                  <p className="text-2xl font-bold mt-2 text-rose-400">{stats?.rejectedProducts || 0}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
