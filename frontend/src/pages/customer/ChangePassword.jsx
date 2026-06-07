import { useState } from "react";
import api from "../../utils/api";
import { Eye, EyeOff, Lock } from "lucide-react";

export default function ChangePassword() {
  const [oldPassword, setOld] = useState("");
  const [newPassword, setNew] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const submit = async () => {
    if (!oldPassword || !newPassword) return alert("Fill all fields");

    try {
      setLoading(true);
      await api.put("/auth/change-password", {
        oldPassword,
        newPassword,
      });

      alert("Password changed successfully");
      setOld("");
      setNew("");
    } catch (e) {
      alert(e.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-3xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-8 shadow-xl">
 
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center bg-black/10 dark:bg-white/10">
            <Lock size={22} />
          </div>
          <h1 className="text-xl font-semibold">Change Password</h1>
          <p className="text-sm opacity-60 mt-1">
            Update your account password
          </p>
        </div>
 
        <div className="relative mb-4">
          <input
            placeholder="Old password"
            type={showOld ? "text" : "password"}
            value={oldPassword}
            onChange={(e) => setOld(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-transparent border border-black/20 dark:border-white/20 outline-none"
          />

          <button
            onClick={() => setShowOld(!showOld)}
            className="absolute right-4 top-1/2 -translate-y-1/2 opacity-60"
          >
            {showOld ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
 
        <div className="relative mb-6">
          <input
            placeholder="New password"
            type={showNew ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNew(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-transparent border border-black/20 dark:border-white/20 outline-none"
          />

          <button
            onClick={() => setShowNew(!showNew)}
            className="absolute right-4 top-1/2 -translate-y-1/2 opacity-60"
          >
            {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
 
        <button
          disabled={loading}
          onClick={submit}
          className="w-full py-3 rounded-xl border border-black/30 dark:border-white/30 text-sm hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition disabled:opacity-50"
        >
          {loading ? "Updating..." : "Change Password"}
        </button>

      </div>
    </div>
  );
}
