import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import NotFound from "../pages/customer/NotFound";

import Home from "../pages/customer/Home";
import Products from "../pages/customer/Products";
import Cart from "../pages/customer/Cart";
import Login from "../pages/customer/Login";
import Register from "../pages/customer/Register";
import Checkout from "../pages/customer/Checkout";
import Orders from "../pages/customer/Orders";
import Contact from "../pages/customer/Contact";
import Profile from "../pages/customer/Profile";
import OrderSuccess from "../pages/customer/OrderSuccess";
import OrderFailed from "../pages/customer/OrderFailed";
import Addresses from "../pages/customer/Addresses";
import OrderDetails from "../pages/customer/OrderDetails";
import ProductDetails from "../pages/customer/ProductDetails";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import Wishlist from "../pages/customer/Wishlist";
import GoogleSuccess from "../pages/customer/GoogleSuccess";
import ChangePassword from "../pages/customer/ChangePassword";
import ResetPassword from "../pages/customer/ResetPassword";
import ForgotPassword from "../pages/customer/ForgotPassword";

import DashboardLayout from "../layouts/DashboardLayout";
import AdminRoute from "./AdminRoute";
import AdminDashboard from "../pages/admin/Dashboard";
import AdminUsers from "../pages/admin/Users";
import AdminRetailers from "../pages/admin/Retailers";
import AdminProducts from "../pages/admin/Products";
import AdminOrders from "../pages/admin/Orders";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/google-success" element={<GoogleSuccess />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders/:id" element={<OrderDetails />} />
          <Route path="/order-success/:id" element={<OrderSuccess />} />
          <Route path="/order-failed" element={<OrderFailed />} />
          <Route path="/addresses" element={<Addresses />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/change-password" element={<ChangePassword />} />
        </Route>
      </Route>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />
      <Route
        path="/reset-password/:token"
        element={
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        }
      />

      {/* Admin Protected Routes */}
      <Route element={<AdminRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/retailers" element={<AdminRetailers />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
