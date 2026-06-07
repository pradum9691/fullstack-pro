import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import AuthLayout from "../../layouts/AuthLayout";
import { Mail, Lock, User } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
  if (data.password !== data.confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  const payload = {
    name: data.name,
    email: data.email,
    password: data.password,
  };

  await api.post("/auth/register", payload);
  navigate("/login");
};


  return (
    <AuthLayout title="SIGN UP">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
 
        <div className="relative">
          <User
            size={16}
            className="absolute left-0 top-1/2 -translate-y-1/2 text-white/40"
          />
          <input
            {...register("name", { required: true })}
            type="text"
            placeholder="Full Name"
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

    
        <div className="relative">
          <Lock
            size={16}
            className="absolute left-0 top-1/2 -translate-y-1/2 text-white/40"
          />
          <input
            {...register("confirmPassword", { required: true })}
            type="password"
            placeholder="Confirm Password"
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
          "
        >
          {isSubmitting ? "CREATING..." : "SIGN UP"}
        </button>

     
        <p className="text-center text-xs text-white/40 pt-6">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-white hover:underline"
          >
            Sign In
          </button>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Register;
