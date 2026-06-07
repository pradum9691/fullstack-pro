import Navbar from "../components/layout/Navbar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black dark:bg-black dark:text-white transition-colors">
      <Navbar />
      <main className="flex-1 pt-24">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
