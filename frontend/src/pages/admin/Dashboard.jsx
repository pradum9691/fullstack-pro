import { useEffect, useState } from "react";
import api from "../../utils/api";
import { 
  Users, 
  UserCheck, 
  UserX, 
  ShoppingBag, 
  DollarSign, 
  Package, 
  Clock, 
  CheckCircle,
  AlertCircle
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

  const userStats = [
    { label: "Total Users", value: stats?.totalUsers || 0, icon: Users, color: "text-blue-400" },
    { label: "Active Users", value: stats?.activeUsers || 0, icon: UserCheck, color: "text-emerald-400" },
    { label: "Blocked Users", value: stats?.blockedUsers || 0, icon: UserX, color: "text-rose-400" },
  ];

  const businessStats = [
    { label: "Total Revenue", value: `₹${stats?.totalSales?.toLocaleString() || 0}`, icon: DollarSign, color: "text-amber-400" },
    { label: "Total Orders", value: stats?.totalOrders || 0, icon: ShoppingBag, color: "text-purple-400" },
    { label: "Pending Orders", value: stats?.pendingOrders || 0, icon: Clock, color: "text-yellow-400" },
  ];

  const productStats = [
    { label: "Total Products", value: stats?.totalProducts || 0, icon: Package, color: "text-sky-400" },
    { label: "Pending Approvals", value: stats?.pendingProducts || 0, icon: Clock, color: "text-orange-400" },
    { label: "Approved Products", value: stats?.approvedProducts || 0, icon: CheckCircle, color: "text-emerald-400" },
  ];

  // Calculate percentages
  const activeUserPercent = stats?.totalUsers ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0;
  const approvedProductPercent = stats?.totalProducts ? Math.round((stats.approvedProducts / stats.totalProducts) * 100) : 0;

  return (
    <div className="space-y-10 pb-12 bg-neutral-950 text-white">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-semibold tracking-wide">Dashboard</h1>
        <p className="text-sm text-neutral-400 mt-2">Live metrics and overview of Annesie Whites.</p>
      </div>

      {/* Stats Sections */}
      <div className="space-y-8">
        {/* Row 1: Sales & Orders */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-4">Financials & Sales</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {businessStats.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div 
                  key={idx} 
                  className="bg-neutral-900 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-400 font-medium">{item.label}</span>
                    <Icon className={item.color} size={20} />
                  </div>
                  <h3 className="text-3xl font-bold mt-4 tracking-tight">{item.value}</h3>
                </div>
              );
            })}
          </div>
        </div>

        {/* Row 2: User Stats */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-4">User Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {userStats.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div 
                  key={idx} 
                  className="bg-neutral-900 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-400 font-medium">{item.label}</span>
                    <Icon className={item.color} size={20} />
                  </div>
                  <h3 className="text-3xl font-bold mt-4 tracking-tight">{item.value}</h3>
                </div>
              );
            })}
          </div>
        </div>

        {/* Row 3: Product Stats */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-4">Product Catalog</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {productStats.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div 
                  key={idx} 
                  className="bg-neutral-900 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-400 font-medium">{item.label}</span>
                    <Icon className={item.color} size={20} />
                  </div>
                  <h3 className="text-3xl font-bold mt-4 tracking-tight">{item.value}</h3>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Analytics Visualizer Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Ratio card */}
        <div className="bg-neutral-900 border border-white/5 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">User Engagement Ratio</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2 text-neutral-400">
                <span>Active Users ({activeUserPercent}%)</span>
                <span>Blocked ({100 - activeUserPercent}%)</span>
              </div>
              <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                  style={{ width: `${activeUserPercent}%` }}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5 text-center">
              <div>
                <p className="text-[10px] text-neutral-500 uppercase font-semibold">Customers</p>
                <p className="text-xl font-bold mt-1 text-white">{stats?.customers || 0}</p>
              </div>
              <div>
                <p className="text-[10px] text-neutral-500 uppercase font-semibold">Retailers</p>
                <p className="text-xl font-bold mt-1 text-white">{stats?.retailers || 0}</p>
              </div>
              <div>
                <p className="text-[10px] text-neutral-500 uppercase font-semibold">Admins</p>
                <p className="text-xl font-bold mt-1 text-white">{stats?.admins || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product approval Ratio card */}
        <div className="bg-neutral-900 border border-white/5 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Catalog Health</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2 text-neutral-400">
                <span>Approved Products ({approvedProductPercent}%)</span>
                <span>Pending/Rejected ({100 - approvedProductPercent}%)</span>
              </div>
              <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                  style={{ width: `${approvedProductPercent}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5 text-center">
              <div>
                <p className="text-[10px] text-neutral-500 uppercase font-semibold">Pending Approvals</p>
                <p className="text-xl font-bold mt-1 text-orange-400">{stats?.pendingProducts || 0}</p>
              </div>
              <div>
                <p className="text-[10px] text-neutral-500 uppercase font-semibold">Rejected Products</p>
                <p className="text-xl font-bold mt-1 text-rose-500">{stats?.rejectedProducts || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
