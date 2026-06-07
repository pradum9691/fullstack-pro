import React from "react";  
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import api from "../../utils/api";
import { useCart } from "../../context/CartContext";
import { motion } from "framer-motion";

const ProductDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToCart, buyNow } = useCart();

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);

  const handleBuyNow = async () => {
    try {
      await buyNow(product._id, 1);
      navigate("/checkout");
    } catch (err) {
      navigate("/login");
    }
  };
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const res = await api.get(`/products/${id}`);
        setProduct(res.data.data);
      } catch (error) {
        console.error("Product fetch error:", error);
 
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-black/20 dark:border-white/20 border-t-black dark:border-t-white animate-spin" />
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white transition-colors">
      <Navbar />
      <div className="max-w-6xl mx-auto px-2 pt-15 pb-20 grid lg:grid-cols-2 gap-15">
 
        <div>
        
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="rounded-3xl overflow-hidden bg-black/5 dark:bg-white/5"
          >
            <img
              src={product.images?.[activeImage]}
              alt={product.name}
              className="w-full h-[420px] object-cover"
            />
          </motion.div>
 
          {product.images?.length > 1 && (
            <div className="mt-4 flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`h-16 w-16 rounded-xl overflow-hidden border transition
                    ${
                      activeImage === i
                        ? "border-black dark:border-white"
                        : "border-black/10 dark:border-white/10 opacity-70"
                    }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
 
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col"
        >
          <span className="text-[11px] tracking-[0.35em] uppercase opacity-60">
            {product.category}
          </span>
          <h1 className="mt-3 text-3xl md:text-4xl font-semibold leading-tight">
            {product.name}
          </h1>
          <p className="mt-4 text-sm md:text-base opacity-70 max-w-lg">
            {product.description}
          </p>
 
          <div className="mt-6 text-2xl font-semibold">₹ {product.price}</div>

 
          <p className="mt-2 text-sm opacity-60">
            {product.stock > 0
              ? `${product.stock} items in stock`
              : "Out of stock"}
          </p>

 
          <div className="mt-8 flex gap-4">
            <button
              disabled={product.stock === 0}
              onClick={async () => {
                 console.log("ADD TO CART CLICKED 👉", product._id);
                try {
                  await addToCart(product._id, 1);
                  alert("Added to cart");
                } catch {
                  navigate("/login");
                }
              }}
              className="
                px-10 py-3 rounded-full
                bg-black text-white
                dark:bg-white dark:text-black
                text-sm font-medium
                hover:opacity-90
                disabled:opacity-40
                transition
              "
            >
              Add to cart
            </button>

            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="
                px-10 py-3 rounded-full
                border border-black/20 dark:border-white/20
                text-sm font-medium
                opacity-70 hover:opacity-100
                transition
              "
            >
              Buy now
            </button>
          </div>

   
          <div className="mt-10 pt-4 border-t border-black/10 dark:border-white/10 text-xs opacity-60 space-y-2">
            <p>• Free delivery on orders over ₹999</p>
            <p>• 7‑day easy returns</p>
            <p>• Premium quality guaranteed</p>
            <p>• Product status: {product.status}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default React.memo(ProductDetails);
