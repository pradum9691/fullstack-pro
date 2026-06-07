import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import Navbar from "../../components/layout/Navbar";

const Cart = () => {
  const { cart, loading, updateQty, removeFromCart } = useCart();
  const navigate = useNavigate();
 
  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-black/20 dark:border-white/20 border-t-black dark:border-t-white rounded-full animate-spin" />
      </div>
    );
  }
 
  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-2xl font-semibold">Your cart is empty</h1>
        <p className="text-sm opacity-60 mt-2">
          Add products to continue shopping
        </p>

        <button
          onClick={() => navigate("/products")}
          className="mt-6 px-8 py-3 rounded-full bg-black text-white dark:bg-white dark:text-black text-sm font-medium hover:opacity-90 transition"
        >
          Browse products
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-24">
 
        <h1 className="text-2xl sm:text-3xl font-semibold mb-10">
          Shopping Cart
        </h1>
 
        <div className="space-y-6">
          {cart.items.map((item) => (
            <div
              key={item.product._id}
              className="
                flex flex-col sm:flex-row
                gap-5 sm:gap-6
                border border-black/10 dark:border-white/10
                rounded-2xl p-5
                bg-white dark:bg-black
              "
            >
 
              <img
                src={item.product.images?.[0]}
                alt={item.product.name}
                className="
                  w-full sm:w-28
                  h-52 sm:h-28
                  object-cover rounded-xl
                "
              />
 
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-medium leading-snug line-clamp-2">
                    {item.product.name}
                  </h3>

                  <p className="text-sm opacity-60 mt-1">
                    ₹ {item.product.price}
                  </p>
                </div>
 
                <div className="flex items-center gap-3 mt-5">
                  <button
                    onClick={() =>
                      item.quantity > 1 &&
                      updateQty(item.product._id, item.quantity - 1)
                    }
                    className="
                      w-8 h-8 rounded-full
                      border border-black/20 dark:border-white/20
                      text-sm
                      hover:bg-black hover:text-white
                      dark:hover:bg-white dark:hover:text-black
                      transition
                    "
                  >
                    −
                  </button>

                  <span className="text-sm w-6 text-center font-medium">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() =>
                      updateQty(item.product._id, item.quantity + 1)
                    }
                    className="
                      w-8 h-8 rounded-full
                      border border-black/20 dark:border-white/20
                      text-sm
                      hover:bg-black hover:text-white
                      dark:hover:bg-white dark:hover:text-black
                      transition
                    "
                  >
                    +
                  </button>

                  <button
                    onClick={() => removeFromCart(item.product._id)}
                    className="ml-4 text-xs opacity-60 hover:opacity-100 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
 
              <div
                className="
                  text-sm font-semibold
                  sm:self-center
                  text-right sm:text-left
                  whitespace-nowrap
                "
              >
                ₹ {item.subtotal}
              </div>
            </div>
          ))}
        </div>
 
        <div
          className="
            mt-12
            flex flex-col sm:flex-row
            items-stretch sm:items-center
            justify-between gap-5
            border-t border-black/10 dark:border-white/10
            pt-6
          "
        >
          <div className="text-lg sm:text-xl font-semibold">
            Total: ₹ {cart.totalAmount}
          </div>

          <button
            onClick={() => navigate("/checkout")}
            className="
              w-full sm:w-auto
              px-10 py-3 rounded-full
              bg-black text-white
              dark:bg-white dark:text-black
              text-sm font-medium
              hover:opacity-90 transition
            "
          >
            Proceed to checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;