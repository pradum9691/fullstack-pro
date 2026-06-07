import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import AuthLayout from "../../layouts/AuthLayout";
import { Mail } from "lucide-react";
import { toast } from "react-toastify";


const ForgotPassword = () => {
  const { register, handleSubmit } = useForm();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setError("");
      setMessage("");

      const res = await api.post("/auth/forgot-password", data);
      toast.success("Password reset link sent to email");
      setMessage(res.data.message || "Reset link sent to your email 📩");
    } catch (err) {
      toast.error("Email not registered");
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <AuthLayout title="FORGOT PASSWORD" subtitle="Enter your email to reset password">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && <p className="text-xs text-red-400 text-center">{error}</p>}
        {message && <p className="text-xs text-green-400 text-center">{message}</p>}

        <div className="relative">
          <Mail size={16} className="absolute left-0 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            {...register("email", { required: true })}
            type="email"
            placeholder="Enter your email"
            className="w-full bg-transparent border-b border-white/30 pl-7 pb-2 text-sm text-white outline-none"
          />
        </div>

        <button className="w-full py-3 border text-white hover:bg-white hover:text-black transition">
          SEND RESET LINK
        </button>

        <p className="text-center text-xs text-white/40">
          Back to{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-white underline"
          >
            Login
          </button>
        </p>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
