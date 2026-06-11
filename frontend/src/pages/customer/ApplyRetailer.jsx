import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { toast } from "react-toastify";
import { Store, MapPin, FileText, Building2, CreditCard } from "lucide-react";
import { motion } from "framer-motion";

const ApplyRetailer = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    shopName: "",
    shopAddress: "",
    gstNumber: "",
    bankDetails: {
      accountNumber: "",
      ifsc: "",
      bankName: "",
    },
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post("/retailer/apply", formData);
      if (res.data.success) {
        toast.success("Application submitted successfully! Wait for admin approval.");
        navigate("/profile");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white pt-28 px-6 pb-20">
      <div className="max-w-2xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-neutral-900 border border-white/10 rounded-3xl p-8 md:p-10"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Store size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Become a Retailer</h1>
              <p className="text-sm text-neutral-400 mt-1">Join our marketplace and start selling your products.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b border-white/10 pb-2 flex items-center gap-2">
                <Building2 size={18} className="text-indigo-400" />
                Business Details
              </h3>
              
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">Shop Name</label>
                <input
                  required
                  type="text"
                  value={formData.shopName}
                  onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="e.g. Annesie Electronics"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5 flex items-center gap-1">
                  <MapPin size={12} /> Shop Address
                </label>
                <textarea
                  required
                  value={formData.shopAddress}
                  onChange={(e) => setFormData({ ...formData, shopAddress: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors min-h-[100px]"
                  placeholder="Complete shop address"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5 flex items-center gap-1">
                  <FileText size={12} /> GST Number
                </label>
                <input
                  required
                  type="text"
                  value={formData.gstNumber}
                  onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value.toUpperCase() })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors uppercase"
                  placeholder="22AAAAA0000A1Z5"
                />
                <p className="text-[10px] text-neutral-500 mt-1">Must be a valid 15-character GSTIN</p>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-medium border-b border-white/10 pb-2 flex items-center gap-2">
                <CreditCard size={18} className="text-purple-400" />
                Bank Details (Optional)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">Bank Name</label>
                  <input
                    type="text"
                    value={formData.bankDetails.bankName}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      bankDetails: { ...formData.bankDetails, bankName: e.target.value } 
                    })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="e.g. HDFC Bank"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">IFSC Code</label>
                  <input
                    type="text"
                    value={formData.bankDetails.ifsc}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      bankDetails: { ...formData.bankDetails, ifsc: e.target.value.toUpperCase() } 
                    })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors uppercase"
                    placeholder="HDFC0001234"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">Account Number</label>
                  <input
                    type="text"
                    value={formData.bankDetails.accountNumber}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      bankDetails: { ...formData.bankDetails, accountNumber: e.target.value } 
                    })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="XXXXXXXXXXXX"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-4 rounded-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/25"
            >
              {loading ? "Submitting Application..." : "Submit Application"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ApplyRetailer;
