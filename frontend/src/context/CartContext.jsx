import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import api from "../utils/api";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const user = useSelector((state) => state.auth.user);

  const [cart, setCart] = useState({
    items: [],
    totalAmount: 0,
    itemsCount: 0,
  });

  const [loading, setLoading] = useState(false);

  const hasToken = () => !!localStorage.getItem("token");
 
  const fetchCart = useCallback(async () => {
    if (!hasToken()) return;

    try {
      setLoading(true);
      const res = await api.get("/cart");
      setCart(res.data.data);
    } catch (err) {
      console.error("Cart fetch failed", err);
      setCart({ items: [], totalAmount: 0, itemsCount: 0 });
    } finally {
      setLoading(false);
    }
  }, []);
 
  useEffect(() => {
    if (user) fetchCart();
    else setCart({ items: [], totalAmount: 0, itemsCount: 0 });
  }, [user, fetchCart]);
 
  const addToCart = useCallback(async (productId, quantity = 1) => {
    if (!hasToken()) throw new Error("NO_TOKEN");

    const res = await api.post("/cart/add", { productId, quantity });
 
    setCart(res.data.data);
  }, []);
 
  const updateQty = useCallback(async (productId, quantity) => {
    if (!hasToken() || quantity < 1) return;

    const res = await api.patch(`/cart/${productId}`, { quantity });

    setCart(res.data.data);
  }, []);
 
  const removeFromCart = useCallback(async (productId) => {
    if (!hasToken()) return;

    const res = await api.delete(`/cart/${productId}`);

    setCart(res.data.data);
  }, []);
 
  const clearCart = useCallback(async () => {
    if (!hasToken()) return;

    await api.delete("/cart");

    setCart({
      items: [],
      totalAmount: 0,
      itemsCount: 0,
    });
  }, []);
 
  const buyNow = useCallback(async (productId, quantity = 1) => {
    if (!hasToken()) throw new Error("NO_TOKEN");

    await api.delete("/cart");
    const res = await api.post("/cart/add", { productId, quantity });

    setCart(res.data.data);
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
        buyNow,
        refreshCart: fetchCart,
        totalItems: cart.itemsCount,
        totalPrice: cart.totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};  