import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../../utils/api";
import { User, Mail, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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
        setName(res.data.data.name);
        setName("")
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black text-black dark:text-white">
        <div className="w-8 h-8 rounded-full border-2 border-black/20 dark:border-white/20 border-t-black dark:border-t-white animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black text-red-500 text-sm">
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
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white pt-28 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-10 shadow-xl">
         
          <div className="flex flex-col items-center">
            <img
              src={avatar}
              onError={(e) => (e.target.src = "/avatar.png")}
              className="w-40 h-40 rounded-full object-cover border-4 border-white dark:border-black shadow-lg mb-4"
            />
            <h1 className="text-2xl font-semibold">{fullName}</h1>
            <p className="text-sm opacity-60">{profile.email}</p>

            <span className="mt-3 px-4 py-1 rounded-full text-xs bg-black/10 dark:bg-white/10 capitalize">
              {profile.role || "customer"}
            </span>
          </div>
 
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            <div className="rounded-2xl p-5 border border-black/10 dark:border-white/10">
              <User size={20} className="opacity-70 mb-2" />
              <p className="text-xs opacity-60">Full Name</p>
              <p className="font-medium">{fullName}</p>
            </div>

            <div className="rounded-2xl p-5 border border-black/10 dark:border-white/10">
              <Mail size={20} className="opacity-70 mb-2" />
              <p className="text-xs opacity-60">Email</p>
              <p className="font-medium break-all">{profile.email}</p>
            </div>

            <div className="rounded-2xl p-5 border border-black/10 dark:border-white/10">
              <Shield size={20} className="opacity-70 mb-2" />
              <p className="text-xs opacity-60">Role</p>
              <p className="font-medium capitalize">
                {profile.role || "customer"}
              </p>
            </div>
          </div>

          <div className="mt-10 max-w-md mx-auto space-y-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-transparent border border-black/20 dark:border-white/20 outline-none"
              placeholder="Your name"
            />

            <button
              disabled={saving}
              onClick={async () => {
                try {
                  setSaving(true);
                  const res = await api.put("/auth/profile", { name });
                  setProfile(res.data.data);
                  setName("")
                  toast.success("Profile updated successfully");
                } catch {
                  toast.error(
                    err.response?.data?.message || "Profile update failed",
                  );
                } finally {
                  setSaving(false);
                }
              }}
              className="w-full px-4 py-2 rounded-lg border border-black/30 dark:border-white/30 text-sm hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
 
          <div className="mt-10 rounded-2xl p-5 border border-black/10 dark:border-white/10">
            <p className="text-xs opacity-60 mb-1">User ID</p>
            <p className="text-xs break-all opacity-80">{profile._id}</p>
          </div>
 
          <div className="mt-8 flex flex-col items-center gap-3">
            <button
              onClick={() => navigate("/addresses")}
              className="px-6 py-2 rounded-full border border-black/20 dark:border-white/20 text-sm hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition"
            >
              Manage Delivery Address
            </button>

            <button
              onClick={() => navigate("/change-password")}
              className="text-sm underline opacity-70 hover:opacity-100"
            >
              Change Password
            </button>
          </div>
        </div>

        {user && (
          <p className="mt-6 text-xs opacity-50 text-center">
            Logged in as <span className="opacity-90">{user.email}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Profile;