import { Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";

const DashboardLayout = () => {
  const [open, setOpen] = useState(true);

  return (
    <div className="h-screen bg-neutral-950 text-white overflow-hidden flex">

  
      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: -260, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -260, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="w-64 bg-black border-r border-white/10"
          >
            <Sidebar close={() => setOpen(false)} />
          </motion.aside>
        )}
      </AnimatePresence>
 
      <div className="flex-1 relative">
        <button
          onClick={() => setOpen(true)}
          className="absolute top-5 left-5 z-20 text-xs opacity-60 hover:opacity-100"
        >
          ☰
        </button>

        <motion.main
          key="page"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="h-full overflow-y-auto p-10"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
};

export default DashboardLayout;
