import { useEffect, useState } from "react";
import api from "../../utils/api";
import { Link } from "react-router-dom";
import { PlusCircle, Search, AlertCircle, Edit, Trash2 } from "lucide-react";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await api.get("/retailer/products");
        if (res.data.success) {
          setProducts(res.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
      case "PENDING":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
      case "REJECTED":
        return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
      default:
        return "bg-neutral-500/10 text-neutral-400 border border-neutral-500/20";
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase()) ||
                        p.category?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

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

  return (
    <div className="space-y-8 pb-12 bg-neutral-950 text-white">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-wide">My Products</h1>
          <p className="text-sm text-neutral-400 mt-2">Manage your product catalog, prices, stock, and monitor approvals.</p>
        </div>
        <Link
          to="/retailer/products/add"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-black font-semibold text-sm rounded-xl hover:bg-neutral-200 transition duration-200 cursor-pointer"
        >
          <PlusCircle size={16} />
          <span>Add Product</span>
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap gap-4 items-center justify-between bg-neutral-900 border border-white/5 p-4 rounded-2xl">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-4 top-3 text-neutral-500" size={18} />
          <input
            type="text"
            placeholder="Search by product name or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black border border-white/10 rounded-xl pl-12 pr-4 py-2.5 text-sm focus:outline-none focus:border-white transition duration-200 text-white placeholder-neutral-500"
          />
        </div>

        <div className="flex gap-2">
          {["ALL", "APPROVED", "PENDING", "REJECTED"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl border transition duration-200 cursor-pointer ${
                statusFilter === status
                  ? "bg-white text-black border-white"
                  : "bg-black text-neutral-400 border-white/10 hover:text-white"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-black/40 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                <th className="px-6 py-4">Product Info</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-neutral-500">
                    No products found matching filters.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-white/5 transition duration-150">
                    {/* Product Image and Name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-neutral-800 flex items-center justify-center overflow-hidden border border-white/10 flex-shrink-0">
                          {product.images?.[0] ? (
                            <img src={product.images[0]} alt="Product" className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-[10px] text-neutral-500 font-bold">No img</span>
                          )}
                        </div>
                        <div className="space-y-0.5 max-w-[240px]">
                          <p className="font-semibold text-white truncate">{product.name}</p>
                          <p className="text-xs text-neutral-500 truncate">{product.description}</p>
                          {product.status === "REJECTED" && product.rejectReason && (
                            <p className="text-[10px] text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-lg inline-block font-medium">
                              Reject Reason: {product.rejectReason}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4 text-neutral-300">
                      <span className="bg-neutral-800 border border-white/5 px-2.5 py-1 rounded-full text-xs">
                        {product.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4 font-semibold text-white">
                      ₹{product.price?.toLocaleString("en-IN")}
                    </td>

                    {/* Stock */}
                    <td className="px-6 py-4">
                      <span className={product.stock === 0 ? "text-red-400 font-semibold" : "text-neutral-300"}>
                        {product.stock === 0 ? "Out of Stock" : `${product.stock} units`}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${getStatusBadge(product.status)}`}>
                        {product.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Products;
