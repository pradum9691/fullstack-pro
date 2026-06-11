import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../../utils/api";
import { User, Mail, Shield, Edit3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Card from "../../components/ui/Card";
import Loader from "../../components/ui/Loader";
import { motion } from "framer-motion";

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const user = useSelector((state) => state.auth.user);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/auth/me");
        setProfile(res.data.data);
        setName("");
      } catch (err) {
        console.error("Profile load failed", err);
        setError("Session expired. Please login again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <Loader fullScreen text="Loading Profile..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-950 text-rose-500 text-sm font-medium">
        {error}
      </div>
    );
  }

  if (!profile) return null;

  const fullName =
    profile.firstName && profile.lastName
      ? `${profile.firstName} ${profile.lastName}`
      : profile.name || "User";

  const rawAvatar = profile?.avatar || user?.avatar;

  const avatar = rawAvatar
    ? `https://images.weserv.nl/?url=${encodeURIComponent(rawAvatar)}`
    : "/avatar.png";

  return (
    <div className="min-h-screen bg-neutral-950 pt-28 px-6 pb-20">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-8 sm:p-12 overflow-hidden border-white/5">
            {/* Background Accent */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-3xl rounded-full opacity-50" />
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="relative group">
                <img
                  src={avatar}
                  onError={(e) => (e.target.src = "/avatar.png")}
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-neutral-900 shadow-2xl mb-4 transition-transform group-hover:scale-105"
                />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{fullName}</h1>
              <p className="text-sm text-neutral-400 mt-1">{profile.email}</p>

              <span className="mt-4 px-5 py-1.5 rounded-full text-xs font-semibold tracking-wider bg-white/10 text-white capitalize border border-white/10 shadow-inner">
                {profile.role || "customer"}
              </span>
            </div>
   
            <div className="grid sm:grid-cols-3 gap-4 mt-12">
              <div className="rounded-2xl p-5 border border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                <User size={20} className="text-indigo-400 mb-3" />
                <p className="text-xs font-medium uppercase tracking-wider text-neutral-500 mb-1">Full Name</p>
                <p className="font-semibold text-white">{fullName}</p>
              </div>

              <div className="rounded-2xl p-5 border border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                <Mail size={20} className="text-purple-400 mb-3" />
                <p className="text-xs font-medium uppercase tracking-wider text-neutral-500 mb-1">Email</p>
                <p className="font-semibold text-white truncate">{profile.email}</p>
              </div>

              <div className="rounded-2xl p-5 border border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                <Shield size={20} className="text-emerald-400 mb-3" />
                <p className="text-xs font-medium uppercase tracking-wider text-neutral-500 mb-1">Role</p>
                <p className="font-semibold text-white capitalize">
                  {profile.role || "customer"}
                </p>
              </div>
            </div>

            <div className="mt-12 max-w-md mx-auto">
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    type="text"
                    icon={Edit3}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Update your name"
                  />
                </div>
                <Button
                  variant="outline"
                  disabled={saving}
                  isLoading={saving}
                  onClick={async () => {
                    if (!name.trim()) return toast.error("Name cannot be empty");
                    try {
                      setSaving(true);
                      const res = await api.put("/auth/profile", { name });
                      setProfile(res.data.data);
                      setName("");
                      toast.success("Profile updated successfully");
                    } catch (err) {
                      toast.error(
                        err.response?.data?.message || "Profile update failed",
                      );
                    } finally {
                      setSaving(false);
                    }
                  }}
                  className="h-12 border-white/20 text-white hover:bg-white hover:text-black"
                >
                  Save
                </Button>
              </div>
            </div>
   
            <div className="mt-12 pt-10 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex flex-col gap-3 w-full sm:w-auto">
                {profile.role === "CUSTOMER" && (
                  <Button
                    variant="gradient"
                    onClick={() => navigate("/apply-retailer")}
                  >
                    Become a Retailer
                  </Button>
                )}
                <Button
                  variant="secondary"
                  onClick={() => navigate("/addresses")}
                >
                  Manage Delivery Address
                </Button>
              </div>

              <div className="flex flex-col items-center sm:items-end gap-2">
                <button
                  onClick={() => navigate("/change-password")}
                  className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Change Password
                </button>
                <p className="text-xs text-neutral-600 font-mono">ID: {profile._id}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;