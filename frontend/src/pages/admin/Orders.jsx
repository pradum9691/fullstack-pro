import { useEffect, useState } from "react";
import api from "../../utils/api";
import { toast } from "react-toastify";
import { 
  Search, 
  Eye, 
  AlertCircle, 
  Calendar, 
  MapPin, 
  Phone, 
  User, 
  TrendingUp, 
  ArrowRight, 
  Download,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Filtering & Pagination States
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrdersCount, setTotalOrdersCount] = useState(0);

  // Selected Order Modal State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
        status: statusFilter !== "ALL" ? statusFilter : undefined,
        search: search ? search : undefined,
      };

      const res = await api.get("/admin/orders", { params });
      if (res.data.success) {
        setOrders(res.data.data);
        setTotalPages(res.data.pagination.pages || 1);
        setTotalOrdersCount(res.data.pagination.total || 0);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter]);

  // Handle Search Trigger (Enter key or Button click)
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchOrders();
  };

  // Change Status of Order
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setIsUpdatingStatus(true);
      const res = await api.patch(`/admin/orders/${orderId}/status`, { status: newStatus });
      if (res.data.success) {
        toast.success("Order status updated successfully");
        
        // Update local list
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: newStatus, statusHistory: res.data.data.statusHistory } : o))
        );

        // Update modal state if open
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder((prev) => ({
            ...prev,
            status: newStatus,
            statusHistory: res.data.data.statusHistory,
          }));
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update order status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // CSV Export Utility
  const handleExportCSV = () => {
    if (orders.length === 0) {
      toast.warn("No data to export");
      return;
    }

    const headers = ["Order ID", "Customer Name", "Customer Email", "Date Placed", "Total Amount", "Status", "Items Count", "Shipping Address"];
    const rows = orders.map(order => [
      order._id,
      order.user?.name || "N/A",
      order.user?.email || "N/A",
      new Date(order.createdAt).toLocaleDateString(),
      order.totalAmount,
      order.status,
      order.items?.length || 0,
      `"${order.address?.addressLine || ""}, ${order.address?.city || ""}, ${order.address?.state || ""} ${order.address?.pincode || ""}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `orders_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV report downloaded successfully!");
  };

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-wide">Manage Orders</h1>
          <p className="text-sm text-neutral-400 mt-2">Track, filter, export and transition order statuses.</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-sm font-medium hover:bg-white hover:text-black hover:border-white transition duration-200 cursor-pointer"
        >
          <Download size={16} />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-neutral-900 border border-white/5 p-4 rounded-2xl space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 text-neutral-500" size={18} />
            <input
              type="text"
              placeholder="Search by Customer Name, Email or Order ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-white transition duration-200 text-white placeholder-neutral-500"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-white text-black font-semibold text-sm rounded-xl hover:bg-neutral-200 transition duration-200 cursor-pointer"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
          {["ALL", "PENDING_PAYMENT", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"].map((status) => (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status);
                setPage(1);
              }}
              className={`px-4 py-2 text-xs font-semibold rounded-xl border transition duration-200 cursor-pointer ${
                statusFilter === status
                  ? "bg-white text-black border-white"
                  : "bg-black text-neutral-400 border-white/10 hover:text-white"
              }`}
            >
              {status === "ALL" ? "ALL ORDERS" : getStatusLabel(status)}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-black/40 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                <th className="px-6 py-4">Order Details</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Total Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Quick Update</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-neutral-500">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-neutral-500">
                    No orders found matching filters.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-white/5 transition duration-150">
                    {/* Order Info */}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="font-mono text-xs text-neutral-400 truncate max-w-[120px]">
                          #{order._id}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="px-6 py-4">
                      <div className="space-y-0.5">
                        <p className="font-medium text-white">{order.user?.name || "N/A"}</p>
                        <p className="text-xs text-neutral-400">{order.user?.email || "N/A"}</p>
                      </div>
                    </td>

                    {/* Total Amount */}
                    <td className="px-6 py-4 font-semibold text-white">
                      ₹{order.totalAmount?.toLocaleString("en-IN")}
                    </td>

                    {/* Status badge */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${getStatusBadgeClass(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>

                    {/* Quick status transitions */}
                    <td className="px-6 py-4">
                      <select
                        disabled={isUpdatingStatus}
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="bg-black border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-neutral-300 focus:outline-none focus:border-white cursor-pointer"
                      >
                        <option value="PENDING_PAYMENT">Pending Payment</option>
                        <option value="PAID">Paid</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </td>

                    {/* Actions */}
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

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/5 bg-black/20">
            <span className="text-xs text-neutral-400">
              Showing Page {page} of {totalPages} ({totalOrdersCount} Total Orders)
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                className="p-2 bg-black border border-white/10 rounded-xl text-neutral-400 hover:text-white disabled:opacity-50 disabled:hover:text-neutral-400 cursor-pointer transition duration-150"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                className="p-2 bg-black border border-white/10 rounded-xl text-neutral-400 hover:text-white disabled:opacity-50 disabled:hover:text-neutral-400 cursor-pointer transition duration-150"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-3xl bg-neutral-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-white/10 bg-black/40 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">Order Invoice & Tracking</h3>
                <p className="text-xs text-neutral-400 font-mono mt-1">ID: {selectedOrder._id}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-3.5 py-1.5 bg-white/5 border border-white/10 hover:bg-white hover:text-black rounded-xl text-xs font-semibold cursor-pointer transition duration-200"
              >
                Close
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Row: Customer & Shipping Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Customer Info Card */}
                <div className="bg-black/50 p-4 border border-white/5 rounded-2xl space-y-3">
                  <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                    <User size={12} />
                    <span>Customer Details</span>
                  </h4>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-white">{selectedOrder.user?.name || "N/A"}</p>
                    <p className="text-xs text-neutral-400">{selectedOrder.user?.email || "N/A"}</p>
                  </div>
                </div>

                {/* Shipping Info Card */}
                <div className="bg-black/50 p-4 border border-white/5 rounded-2xl space-y-3">
                  <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin size={12} />
                    <span>Delivery Address</span>
                  </h4>
                  <div className="space-y-1.5 text-xs text-neutral-300">
                    <p className="font-semibold text-white">{selectedOrder.address?.name}</p>
                    <p className="flex items-center gap-1"><Phone size={10} className="text-neutral-500" /> {selectedOrder.address?.phone}</p>
                    <p>{selectedOrder.address?.addressLine}, {selectedOrder.address?.city}, {selectedOrder.address?.state} - {selectedOrder.address?.pincode}</p>
                  </div>
                </div>
              </div>

              {/* Items Summary */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Products List</h4>
                <div className="bg-black/40 border border-white/5 rounded-2xl overflow-hidden divide-y divide-white/5">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-neutral-800 flex items-center justify-center overflow-hidden border border-white/10 flex-shrink-0">
                          {item.product?.images?.[0] ? (
                            <img src={item.product.images[0]} alt="Product" className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-[10px] text-neutral-500 font-bold">No img</span>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{item.product?.name || "Product Deleted"}</p>
                          <p className="text-xs text-neutral-500">Qty: {item.quantity} × ₹{item.price?.toLocaleString("en-IN")}</p>
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-white">₹{item.subtotal?.toLocaleString("en-IN")}</p>
                    </div>
                  ))}
                  
                  {/* Totals Row */}
                  <div className="p-4 bg-black/80 flex items-center justify-between border-t border-white/10">
                    <span className="text-sm font-bold text-white">Grand Total</span>
                    <span className="text-base font-bold text-white">₹{selectedOrder.totalAmount?.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              {/* Status History / Timeline logs */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp size={12} />
                  <span>Tracking Timeline</span>
                </h4>
                <div className="bg-black/30 border border-white/5 rounded-2xl p-4 space-y-4">
                  {selectedOrder.statusHistory && selectedOrder.statusHistory.length > 0 ? (
                    selectedOrder.statusHistory.map((history, idx) => (
                      <div key={idx} className="flex gap-3 text-xs">
                        <div className="flex flex-col items-center">
                          <div className="h-2 w-2 rounded-full bg-white ring-4 ring-white/10 mt-1.5" />
                          {idx !== selectedOrder.statusHistory.length - 1 && (
                            <div className="w-0.5 flex-1 bg-white/10 my-1" />
                          )}
                        </div>
                        <div className="flex-1 space-y-0.5 pb-2">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-white uppercase tracking-wide">
                              {getStatusLabel(history.status)}
                            </span>
                            <span className="text-[10px] text-neutral-500">
                              {new Date(history.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-[10px] text-neutral-400">Updated by: {history.updatedBy}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-neutral-500 italic">No historical lifecycle logs recorded.</p>
                  )}
                </div>
              </div>

            </div>

            {/* Modal Footer Actions */}
            <div className="px-6 py-4 bg-black/40 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-neutral-400">Order Status:</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider ${getStatusBadgeClass(selectedOrder.status)}`}>
                  {getStatusLabel(selectedOrder.status)}
                </span>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-neutral-400 hidden sm:inline">Transition state to:</span>
                <select
                  disabled={isUpdatingStatus}
                  value={selectedOrder.status}
                  onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                  className="w-full sm:w-auto bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white cursor-pointer"
                >
                  <option value="PENDING_PAYMENT">Pending Payment</option>
                  <option value="PAID">Paid</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
