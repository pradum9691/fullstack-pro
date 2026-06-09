import { useState } from "react";
import api from "../../utils/api";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save, Plus, X } from "lucide-react";

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
  });
  
  // Custom image links lists
  const [images, setImages] = useState([]);
  const [imageInput, setImageInput] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddImage = (e) => {
    e.preventDefault();
    if (!imageInput) return;
    if (!imageInput.startsWith("http://") && !imageInput.startsWith("https://")) {
      toast.error("Please enter a valid image URL");
      return;
    }
    setImages((prev) => [...prev, imageInput]);
    setImageInput("");
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) {
      // Provide a standard premium placeholder image if user didn't enter one
      images.push("https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800");
    }

    try {
      setLoading(true);
      const dataToSubmit = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        images,
      };

      const res = await api.post("/products", dataToSubmit);
      if (res.data.success) {
        toast.success(res.data.message || "Product added! Awaiting admin approval.");
        navigate("/retailer/products");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add product. Check validation constraints.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 bg-neutral-950 text-white max-w-4xl">
      {/* Title */}
      <div className="flex items-center gap-3">
        <Link 
          to="/retailer/products" 
          className="h-10 w-10 bg-neutral-900 border border-white/10 rounded-full flex items-center justify-center text-neutral-400 hover:text-white transition duration-200"
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-3xl font-semibold tracking-wide">Add New Product</h1>
          <p className="text-sm text-neutral-400 mt-2">Submit a product to request catalog addition.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core details card */}
        <div className="bg-neutral-900 border border-white/5 p-6 rounded-2xl space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 border-b border-white/5 pb-3">Product Description</h3>
          
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs text-neutral-400 font-semibold uppercase">Product Title</label>
              <input
                required
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Leather Minimalist Watch"
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white transition duration-200 text-white"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-neutral-400 font-semibold uppercase">Description (Min 10 chars)</label>
              <textarea
                required
                rows="4"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Write description about core specifications, build quality, fabric types, etc..."
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white transition duration-200 text-white resize-none"
              />
            </div>
          </div>
        </div>

        {/* Pricing and Stock Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-neutral-900 border border-white/5 p-6 rounded-2xl flex flex-col gap-2">
            <label className="text-xs text-neutral-400 font-semibold uppercase">Price (INR)</label>
            <input
              required
              type="number"
              min="1"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="1499"
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white transition duration-200 text-white"
            />
          </div>

          <div className="bg-neutral-900 border border-white/5 p-6 rounded-2xl flex flex-col gap-2">
            <label className="text-xs text-neutral-400 font-semibold uppercase">Initial Stock (Units)</label>
            <input
              required
              type="number"
              min="0"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              placeholder="50"
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white transition duration-200 text-white"
            />
          </div>

          <div className="bg-neutral-900 border border-white/5 p-6 rounded-2xl flex flex-col gap-2">
            <label className="text-xs text-neutral-400 font-semibold uppercase">Category</label>
            <input
              required
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g. Watches"
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white transition duration-200 text-white"
            />
          </div>
        </div>

        {/* Images Upload Link Card */}
        <div className="bg-neutral-900 border border-white/5 p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400">Product Images (URLs)</h3>
          
          <div className="flex gap-3">
            <input
              type="text"
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              placeholder="Paste image URL (https://...)"
              className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white transition duration-200 text-white"
            />
            <button
              type="button"
              onClick={handleAddImage}
              className="px-4 py-3 bg-white text-black font-bold rounded-xl flex items-center justify-center hover:bg-neutral-200 transition duration-200 cursor-pointer"
            >
              <Plus size={18} />
            </button>
          </div>

          {/* List of current image links */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              {images.map((img, index) => (
                <div key={index} className="relative group h-24 rounded-xl overflow-hidden border border-white/10 bg-black">
                  <img src={img} alt="preview" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1.5 right-1.5 h-6 w-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 justify-end">
          <Link
            to="/retailer/products"
            className="px-6 py-3 border border-white/10 rounded-xl text-sm font-medium hover:bg-white/5 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-black font-semibold text-sm rounded-xl hover:bg-neutral-200 transition duration-200 disabled:opacity-50 cursor-pointer"
          >
            <Save size={16} />
            <span>{loading ? "Saving..." : "Submit Product"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
