import { Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import RetailerSidebar from "../components/dashboard/RetailerSidebar";

export const RetailerLayout = () => {
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
            <RetailerSidebar close={() => setOpen(false)} />
          </motion.aside>
        )}
      </AnimatePresence>
 
      <div className="flex-1 relative">
        {!open && (
          <button
            onClick={() => setOpen(true)}
            className="absolute top-5 left-5 z-20 h-10 w-10 bg-neutral-900 border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-neutral-800 transition duration-200"
          >
            ☰
          </button>
        )}

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

export default RetailerLayout;
