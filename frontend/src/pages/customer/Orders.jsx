import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import Navbar from "../../components/layout/Navbar";
import { toast } from "react-toastify";

const statusStyle = (status) => {
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

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState(null);
  const navigate = useNavigate();

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/orders/my");
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error("LOAD ORDERS ERROR", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

 
  const payWithRazorpay = async (order) => {
    if (payingId === order._id) return;
    setPayingId(order._id);
    try {
      const res = await api.post("/payments/razorpay-order", {
        orderId: order._id,
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: res.data.order.amount,
        currency: "INR",
        order_id: res.data.order.id,
        name: "MERN Shop",
        description: "Order Payment",
        handler: async function (response) {
          await api.post("/payments/razorpay-verify", {
            ...response,
            orderId: order._id,
          });
          toast.success("Payment successfull");
          await loadOrders();
          navigate(`/order-success/${order._id}`);
        },
        theme: { color: "#000000" },
        modal: {
          ondismiss: () => navigate("/order-failed"),
        },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error("PAYMENT ERROR", err.response?.data || err.message);
      toast.error("Unable to start payment");
    } finally {
      setPayingId(null);
    }
  };
 
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-black/20 border-t-black animate-spin" />
      </div>
    );
  }
 
  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-semibold">No orders yet</h2>
        <p className="text-sm opacity-60 mt-2">Your orders will appear here</p>
        <button
          onClick={() => navigate("/products")}
          className="mt-6 px-8 py-3 rounded-full bg-black text-white"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      <div className="pt-28 pb-24 max-w-6xl mx-auto px-6">
   
        <div className="mb-12">
          <span className="block text-[11px] tracking-[0.35em] uppercase opacity-50 mb-2">
            Account
          </span>
          <h1 className="text-3xl sm:text-4xl font-semibold">My Orders</h1>
        </div>

 
        <div className="space-y-8">
          {orders.map((order) => (
            <div
              key={order._id}
              onClick={() => navigate(`/orders/${order._id}`)}
              className="
                cursor-pointer
                border border-black/10 rounded-3xl
                p-6 sm:p-8
                hover:shadow-lg transition
              "
            >
           
              <div className="flex justify-between items-start gap-4 mb-6">
                <div>
                  <p className="text-[11px] tracking-widest uppercase opacity-50">
                    Order ID
                  </p>
                  <p className="text-sm font-medium mt-1">
                    #{order._id.slice(-6)}
                  </p>
                </div>

                {order.status === "PENDING_PAYMENT" ? (
                  <button
                    disabled={payingId === order._id}
                    onClick={(e) => {
                      e.stopPropagation();
                      payWithRazorpay(order);
                    }}
                    className="px-5 py-2.5 rounded-full bg-black text-white text-xs font-medium disabled:opacity-40"
                  >
                    {payingId === order._id ? "Processing..." : "Pay Now"}
                  </button>
                ) : (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle(
                      order.status,
                    )}`}
                  >
                    {order.status.replaceAll("_", " ")}
                  </span>
                )}
              </div>

               
              <div className="space-y-3 text-sm">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between opacity-80">
                    <span>
                      {item.product?.name} × {item.quantity}
                    </span>
                    <span>₹ {item.subtotal}</span>
                  </div>
                ))}
              </div>

           
              <div className="mt-6 pt-6 border-t border-black/10 flex justify-between items-center">
                <span className="text-sm opacity-60">Order Total</span>
                <span className="text-lg font-semibold">
                  ₹ {order.totalAmount}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
