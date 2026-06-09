import { useEffect, useState } from "react";
import api from "../../utils/api";
import { Search, Eye, AlertCircle, ShoppingBag, MapPin, Phone, Calendar } from "lucide-react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await api.get("/retailer/orders");
        if (res.data.success) {
          setOrders(res.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch retailer orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "DELIVERED":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
      case "SHIPPED":
        return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
      case "PAID":
        return "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20";
      case "PENDING_PAYMENT":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
      case "CANCELLED":
        return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
      default:
        return "bg-neutral-500/10 text-neutral-400 border border-neutral-500/20";
    }
  };

  const getStatusLabel = (status) => {
    return status?.replace("_", " ");
  };

  const filteredOrders = orders.filter((order) => {
    const customerMatch = order.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
                          order.user?.email?.toLowerCase().includes(search.toLowerCase());
    const idMatch = order._id?.toLowerCase().includes(search.toLowerCase());
    return customerMatch || idMatch;
  });

  if (loading && orders.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-neutral-950 text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-white"></div>
      </div>
    );
  }

  if (error && orders.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-neutral-950 text-white p-6">
        <AlertCircle className="text-red-500 mb-4" size={48} />
        <p className="text-lg font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 bg-neutral-950 text-white">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-semibold tracking-wide">My Orders</h1>
        <p className="text-sm text-neutral-400 mt-2">View sales, track delivery details, and inspect purchased items.</p>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap gap-4 items-center justify-between bg-neutral-900 border border-white/5 p-4 rounded-2xl">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-4 top-3 text-neutral-500" size={18} />
          <input
            type="text"
            placeholder="Search by customer name, email or order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black border border-white/10 rounded-xl pl-12 pr-4 py-2.5 text-sm focus:outline-none focus:border-white transition duration-200 text-white placeholder-neutral-500"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-black/40 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">My Earnings (Subtotal)</th>
                <th className="px-6 py-4">Order Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-neutral-500">
                    No retailer orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-white/5 transition duration-150">
                    <td className="px-6 py-4 font-mono text-xs text-neutral-400">#{order._id}</td>
                    <td className="px-6 py-4 text-neutral-300">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-0.5">
                        <p className="font-medium text-white">{order.user?.name || "N/A"}</p>
                        <p className="text-xs text-neutral-400">{order.user?.email || "N/A"}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-white">
                      ₹{order.totalAmount?.toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${getStatusBadgeClass(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/15 hover:bg-white hover:text-black rounded-xl text-xs font-semibold transition duration-200 cursor-pointer"
                      >
                        <Eye size={14} />
                        <span>Details</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-neutral-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
            
            {/* Header */}
            <div className="px-6 py-5 border-b border-white/10 bg-black/40 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">Order Details</h3>
                <p className="text-xs text-neutral-400 font-mono mt-1">ID: {selectedOrder._id}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-3.5 py-1.5 bg-white/5 border border-white/10 hover:bg-white hover:text-black rounded-xl text-xs font-semibold cursor-pointer transition duration-200"
              >
                Close
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Address details */}
              <div className="bg-black/50 p-4 border border-white/5 rounded-2xl space-y-3">
                <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin size={12} />
                  <span>Shipping Address</span>
                </h4>
                <div className="space-y-1 text-xs text-neutral-300">
                  <p className="font-semibold text-white">{selectedOrder.address?.name}</p>
                  <p className="flex items-center gap-1"><Phone size={10} className="text-neutral-500" /> {selectedOrder.address?.phone}</p>
                  <p>{selectedOrder.address?.addressLine}, {selectedOrder.address?.city}, {selectedOrder.address?.state} - {selectedOrder.address?.pincode}</p>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Ordered Items</h4>
                <div className="bg-black/40 border border-white/5 rounded-2xl overflow-hidden divide-y divide-white/5">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-neutral-800 flex items-center justify-center overflow-hidden border border-white/10 flex-shrink-0">
                          {item.product?.images?.[0] ? (
                            <img src={item.product.images[0]} alt="Product" className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-[10px] text-neutral-500 font-bold">No img</span>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{item.product?.name || "Product"}</p>
                          <p className="text-xs text-neutral-500">Qty: {item.quantity} × ₹{item.price?.toLocaleString("en-IN")}</p>
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-white">₹{item.subtotal?.toLocaleString("en-IN")}</p>
                    </div>
                  ))}
                  
                  {/* Totals */}
                  <div className="p-4 bg-black/80 flex items-center justify-between border-t border-white/10">
                    <span className="text-sm font-bold text-white">My Store Total</span>
                    <span className="text-base font-bold text-white">₹{selectedOrder.totalAmount?.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-black/40 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-neutral-400">Order Status:</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider ${getStatusBadgeClass(selectedOrder.status)}`}>
                  {getStatusLabel(selectedOrder.status)}
                </span>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Orders;
