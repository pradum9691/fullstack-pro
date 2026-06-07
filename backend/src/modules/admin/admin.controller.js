import {
  fetchDashboardStats,
  fetchAllUsers,
  updateUserStatus,
  fetchPendingRetailers,
  approveRetailerById,
  rejectRetailerById,
   approveProductById,
   rejectProductById,    
} from "./admin.service.js";

export const getDashboardStats = async (req, res) => {
  const stats = await fetchDashboardStats();
  res.json({ success: true, data: stats });
};

export const getAllUsers = async (req, res) => {
  const users = await fetchAllUsers();
  res.json({ success: true, data: users });
};

export const toggleUserStatus = async (req, res) => {
  const user = await updateUserStatus(req.params.id);
  res.json({
    success: true,
    message: "User status updated",
    data: user,
  });
};

export const getPendingRetailers = async (req, res) => {
  const retailers = await fetchPendingRetailers();
  res.json({ success: true, data: retailers });
};

export const approveRetailer = async (req, res) => {
  const result = await approveRetailerById(req.params.id);
  res.json({
    success: true,
    message: "Retailer approved successfully",
    data: result,
  });
};

export const rejectRetailer = async (req, res) => {
  const result = await rejectRetailerById(req.params.id);
  res.json({
    success: true,
    message: "Retailer rejected",
    data: result,
  });
};

export const approveProduct = async (req, res) => {
  const result = await approveProductById(req.params.id);

  res.json({
    success: true,
    message: "Product approved successfully",
    data: result,
  });
};

export const rejectProduct = async (req, res) => {
  const { reason } = req.body; // optional
  const result = await rejectProductById(req.params.id, reason);

  res.json({
    success: true,
    message: "Product rejected successfully",
    data: result,
  });
};

