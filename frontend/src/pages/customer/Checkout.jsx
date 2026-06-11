import { useCart } from "../../context/CartContext";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { useState, useCallback, useEffect } from "react";
import Navbar from "../../components/layout/Navbar";
import { Minus, Plus, Trash } from "lucide-react";
import {toast} from 'react-toastify'

const Checkout = () => {
  const { cart, loading, updateQty, removeFromCart, refreshCart } = useCart();

  const [placing, setPlacing] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const navigate = useNavigate();
  const handleQtyChange = useCallback(
    async (productId, qty) => {
      if (qty < 1 || updatingId === productId) return;
      setUpdatingId(productId);
      await updateQty(productId, qty);
      setUpdatingId(null);
    },
    [updateQty, updatingId],
  );
  const handleRemove = useCallback(
    async (productId) => {
      if (updatingId === productId) return;
      setUpdatingId(productId);
      await removeFromCart(productId);
      setUpdatingId(null);
    },
    [removeFromCart, updatingId],
  );

  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const res = await api.get("/addresses");
        const list = res.data?.data || [];
        setAddresses(list);

        const def = list.find((a) => a.isDefault);
        setSelectedAddress(def || list[0] || null);
      } catch (err) {
        console.error(
          "ADDRESS LOAD ERROR",
          err.response?.data || err.message,
        );
        setAddresses([]);
      }
    };

    loadAddresses();
  }, []);
  const placeOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select address");
      return;
    }

    try {
      setPlacing(true);

      const res = await api.post("/orders", {
        address: selectedAddress,
      });

      const orderId = res.data.data._id;
      await refreshCart();
      toast.success("Order placed successfully");
      navigate(`/order/success?orderId=${orderId}`);
    } catch (err) {
      toast.error("Order failed");
      console.error("ORDER ERROR", err.response?.data || err.message);
      navigate("/order/failed");
    } finally {
      setPlacing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-black/20 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-semibold">Your cart is empty</h2>
        <button
          onClick={() => navigate("/products")}
          className="mt-6 px-8 py-3 rounded-full bg-black text-white"
        >
          Continue shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-24 pb-28 grid lg:grid-cols-3 gap-12">
 
        <div className="lg:col-span-2 space-y-8">
          <h1 className="text-3xl font-semibold tracking-tight">Checkout</h1>

          {cart.items.map((item) => (
            <div
              key={item.product._id}
              className="flex gap-6 items-center border border-black/10 rounded-3xl p-6
                         hover:shadow-lg transition-shadow"
            >
              <img
                src={item.product.images?.[0]}
                className="w-32 h-40 rounded-2xl object-cover bg-black/5"
                alt={item.product.name}
              />

              <div className="flex-1 space-y-2">
                <h3 className="text-lg font-medium">{item.product.name}</h3>
                <p className="text-sm opacity-60">₹ {item.product.price}</p>

                <div className="flex items-center gap-4 mt-4">
                  <button
                    disabled={updatingId === item.product._id}
                    onClick={() =>
                      handleQtyChange(item.product._id, item.quantity - 1)
                    }
                    className="p-2 rounded-full border hover:bg-black hover:text-white
                               transition disabled:opacity-40"
                  >
                    <Minus size={14} />
                  </button>

                  <span className="text-sm font-medium">{item.quantity}</span>

                  <button
                    disabled={updatingId === item.product._id}
                    onClick={() =>
                      handleQtyChange(item.product._id, item.quantity + 1)
                    }
                    className="p-2 rounded-full border hover:bg-black hover:text-white
                               transition disabled:opacity-40"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-end gap-4">
                <button
                  disabled={updatingId === item.product._id}
                  onClick={() => handleRemove(item.product._id)}
                  className="opacity-50 hover:opacity-100 disabled:opacity-30"
                >
                  <Trash size={16} />
                </button>

                <div className="text-lg font-semibold">₹ {item.subtotal}</div>
              </div>
            </div>
          ))}
        </div>
 
        <div className="space-y-8 h-fit">
 
          <div className="border border-black/10 rounded-3xl p-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">Delivery Address</h2>
              <button
                onClick={() => navigate("/addresses")}
                className="text-sm underline opacity-70"
              >
                Manage
              </button>
            </div>

            <p className="text-xs opacity-60 mb-4">
              Select one address to continue
            </p>

            {addresses.length === 0 ? (
              <p className="text-sm opacity-60 italic">
                No address found. Please add one to continue.
              </p>
            ) : (
              <div className="space-y-4">
                {addresses.map((a) => (
                  <label
                    key={a._id}
                    className={`flex gap-4 items-start border p-4 rounded-xl cursor-pointer transition
                      ${
                        selectedAddress?._id === a._id
                          ? "border-black bg-black/5"
                          : "hover:border-black/40"
                      }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      checked={selectedAddress?._id === a._id}
                      onChange={() => setSelectedAddress(a)}
                      className="mt-1 accent-black"
                    />

                    <div className="text-sm">
                      <p className="font-medium">{a.name}</p>
                      <p>{a.addressLine}</p>
                      <p>
                        {a.city}, {a.state} - {a.pincode}
                      </p>
                      <p>{a.phone}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
 
          <div className="border border-black/10 rounded-3xl p-8 bg-black/[0.02] sticky top-28">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span>Items</span>
                <span>{cart.itemsCount}</span>
              </div>

              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹ {cart.totalAmount}</span>
              </div>

              <div className="flex justify-between text-green-600">
                <span>Delivery</span>
                <span>Free</span>
              </div>

              <div className="border-t pt-4 flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>₹ {cart.totalAmount}</span>
              </div>
            </div>

            <button
              onClick={placeOrder}
              disabled={placing || !selectedAddress}
              className="mt-8 w-full py-4 rounded-full bg-black text-white
                         text-lg font-medium tracking-wide
                         hover:opacity-90 transition
                         disabled:opacity-40"
            >
              {placing ? "Placing order..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
