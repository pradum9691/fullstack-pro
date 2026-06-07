import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import Navbar from "../../components/layout/Navbar";

const statusColor = (status) => {
  switch (status) {
    case "PENDING_PAYMENT":
      return "bg-yellow-100 text-yellow-700";
    case "PAID":
      return "bg-green-100 text-green-700";
    case "SHIPPED":
      return "bg-blue-100 text-blue-700";
    case "DELIVERED":
      return "bg-emerald-100 text-emerald-700";
    case "CANCELLED":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/orders/my/${id}`);
        setOrder(res.data.data);
      } catch (err) {
        console.error("ORDER LOAD ERROR 👉", err);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);
 
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-black/20 border-t-black rounded-full animate-spin" />
      </div>
    );
  }
 
  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-sm opacity-60 mb-4">Order not found</p>
        <button
          onClick={() => navigate("/orders")}
          className="px-6 py-3 rounded-full bg-black text-white"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 pt-28 pb-24 space-y-12">
 
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Order Details
            </h1>
            <p className="text-sm opacity-60 mt-1">Order ID: {order._id}</p>
          </div>

          <span
            className={`px-4 py-2 rounded-full text-xs font-medium ${statusColor(
              order.status,
            )}`}
          >
            {order.status.replaceAll("_", " ")}
          </span>
        </div>
 
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            {
              label: "Order Date",
              value: new Date(order.createdAt).toDateString(),
            },
            { label: "Items", value: order.items.length },
            { label: "Total Amount", value: `₹ ${order.totalAmount}` },
          ].map((s, i) => (
            <div
              key={i}
              className="rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-6 shadow-sm"
            >
              <p className="text-xs opacity-60">{s.label}</p>
              <p className="text-sm font-medium mt-1">{s.value}</p>
            </div>
          ))}
        </div>

     
        <div>
          <h2 className="text-xl font-semibold mb-4">Items</h2>

          <div className="space-y-4">
            {order.items.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-6 rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-5 hover:shadow-md transition"
              >
                <div>
                  <p className="text-sm font-medium">
                    {item.product?.name || "Product"}
                  </p>
                  <p className="text-xs opacity-60 mt-1">
                    Qty: {item.quantity}
                  </p>
                </div>

                <div className="text-sm font-medium">₹ {item.subtotal}</div>
              </div>
            ))}
          </div>
        </div>
 
        <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-6">
          <h2 className="text-lg font-semibold mb-4">Order Tracking</h2>

          <div className="space-y-4">
            {order.statusHistory?.map((s, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-2 h-2 mt-2 rounded-full bg-black dark:bg-white" />
                <div>
                  <p className="text-sm font-medium">
                    {s.status.replaceAll("_", " ")}
                  </p>
                  <p className="text-xs opacity-60">
                    {new Date(s.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
 
        {order.status === "PAID" && (
          <button
            onClick={async () => {
              try {
                await api.post(`/orders/my/${order._id}/cancel`);
                alert("Order cancelled & refund started 💸");
                window.location.reload();
              } catch (err) {
                alert(err.response?.data?.message || "Cancel failed");
              }
            }}
            className="px-6 py-3 rounded-full border border-red-500 text-red-600 text-sm hover:bg-red-500 hover:text-white transition"
          >
            Cancel Order
          </button>
        )}
 
        <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-6">
          <h2 className="text-lg font-semibold mb-3">Delivery Address</h2>

          <div className="text-sm opacity-80 space-y-1">
            <p className="font-medium">{order.address?.name}</p>
            <p>{order.address?.addressLine}</p>
            <p>
              {order.address?.city}, {order.address?.state} –{" "}
              {order.address?.pincode}
            </p>
            <p>📞 {order.address?.phone}</p>
          </div>
        </div>
        <button
          onClick={() => {
            window.open(
              `${import.meta.env.VITE_API_URL}/orders/my/${order._id}/invoice?token=${localStorage.getItem("token")}`,
              "_blank",
            );
          }}
          className="
    group flex items-center gap-2
    px-7 py-3 rounded-full
    border border-black/20 dark:border-white/20
    text-sm font-medium
    bg-black text-white
    dark:bg-white dark:text-black
    hover:scale-[1.03]
    hover:shadow-lg
    transition-all duration-200
  "
        >
          <svg
            className="w-4 h-4 opacity-80 group-hover:opacity-100 transition"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M12 3v12m0 0l4-4m-4 4l-4-4" />
            <path d="M4 17h16" />
          </svg>
          Download Invoice
        </button>
 
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate("/orders")}
            className="px-6 py-3 rounded-full border border-black/30 dark:border-white/30 text-sm hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition"
          >
            Back to Orders
          </button>

          <button
            onClick={() => navigate("/products")}
            className="px-6 py-3 rounded-full bg-black text-white dark:bg-white dark:text-black text-sm"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
