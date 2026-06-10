import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import api from "../../utils/api";
import { loginSuccess } from "../../store/slices/authSlice";
import AuthLayout from "../../layouts/AuthLayout";
import { Mail, Lock } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const redirectTo = location.state?.from || "/";

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setError("");

      const res = await api.post("/auth/login", data);
      localStorage.setItem("token", res.data.token);

      const loggedUser = res.data.data;
      dispatch(loginSuccess({ user: loggedUser, token: res.data.token }));

      toast.success("Login successful");

      // Role-based redirect
      if (loggedUser.role === "ADMIN") {
        navigate("/admin/dashboard", { replace: true });
      } else if (loggedUser.role === "RETAILER") {
        navigate("/retailer/dashboard", { replace: true });
      } else {
        navigate(redirectTo, { replace: true });
      }
    } catch (err) {
      toast.error("Invalid email or password");
      setError(err.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <AuthLayout
      title="MEMBER LOGIN"
      subtitle="Enter your credentials to continue"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {error && <p className="text-xs text-red-400 text-center">{error}</p>}

        <div className="relative">
          <Mail
            size={16}
            className="absolute left-0 top-1/2 -translate-y-1/2 text-white/40"
          />
          <input
            {...register("email", { required: true })}
            type="email"
            placeholder="Email ID"
            className="
              w-full bg-transparent
              border-b border-white/30
              pl-7 pb-2
              text-sm text-white
              placeholder-white/40
              outline-none
              focus:border-white
            "
          />
        </div>

        <div className="relative">
          <Lock
            size={16}
            className="absolute left-0 top-1/2 -translate-y-1/2 text-white/40"
          />
          <input
            {...register("password", { required: true })}
            type="password"
            placeholder="Password"
            className="
              w-full bg-transparent
              border-b border-white/30
              pl-7 pb-2
              text-sm text-white
              placeholder-white/40
              outline-none
              focus:border-white
            "
          />
        </div>

        <div className="flex items-center justify-between text-xs text-white/50">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" />
            Remember me
          </label>

          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="hover:text-white transition"
          >
            Forgot Password?
          </button>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="
            w-full mt-6 py-3
            border border-white/40
            text-sm tracking-widest
            text-white
            hover:bg-white hover:text-black
            transition
            disabled:opacity-50
          "
        >
          {isSubmitting ? "LOGGING IN..." : "LOGIN"}
        </button>
        <button
          type="button"
          onClick={() =>
            (window.location.href =
              "https://fullstack-pro-fq92.onrender.com/api/auth/google")
          }
          className="w-full py-3 border mt-4 text-white"
        >
          Continue with Google
        </button>

        <p className="text-center text-xs text-white/40 pt-6">
          Don’t have an account?{" "}
          <button
            type="button"
            onClick={() =>
              navigate("/register", { state: { from: redirectTo } })
            }
            className="text-white hover:underline"
          >
            Sign Up
          </button>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;
