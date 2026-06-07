import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../utils/api";
import AuthLayout from "../../layouts/AuthLayout";
import { Lock } from "lucide-react";

const ResetPassword = () => {
  const { token } = useParams();
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setError("");

      await api.post(`/auth/reset-password/${token}`, data);

      alert("Password reset successfull");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Reset link expired");
    }
  };

  return (
    <AuthLayout title="RESET PASSWORD" subtitle="Enter your new password">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && <p className="text-xs text-red-400 text-center">{error}</p>}

        <div className="relative">
          <Lock size={16} className="absolute left-0 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            {...register("password", { required: true })}
            type="password"
            placeholder="New Password"
            className="w-full bg-transparent border-b border-white/30 pl-7 pb-2 text-sm text-white outline-none"
          />
        </div>

        <button className="w-full py-3 border text-white hover:bg-white hover:text-black transition">
          RESET PASSWORD
        </button>
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;
