import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const variants = {
  primary: "bg-white text-black hover:bg-neutral-200 dark:bg-black dark:text-white dark:hover:bg-neutral-800 border border-transparent dark:border-white/10",
  secondary: "bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 border border-transparent dark:border-white/5",
  outline: "bg-transparent text-black dark:text-white border border-black/20 dark:border-white/20 hover:border-black/50 dark:hover:border-white/50",
  ghost: "bg-transparent text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10",
  danger: "bg-rose-500 text-white hover:bg-rose-600 border border-transparent",
  gradient: "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg hover:shadow-indigo-500/25 border border-transparent"
};

const sizes = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
  icon: "p-3"
};

const Button = ({ 
  children, 
  variant = "primary", 
  size = "md", 
  className = "", 
  isLoading = false, 
  disabled = false, 
  fullWidth = false,
  icon: Icon,
  ...props 
}) => {
  return (
    <motion.button
      whileHover={{ y: disabled || isLoading ? 0 : -2 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      disabled={disabled || isLoading}
      className={`
        relative overflow-hidden font-medium rounded-xl flex items-center justify-center gap-2 transition-all duration-300
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? "w-full" : ""}
        ${disabled || isLoading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        <>
          {Icon && <Icon size={18} />}
          {children}
        </>
      )}
    </motion.button>
  );
};

export default Button;
