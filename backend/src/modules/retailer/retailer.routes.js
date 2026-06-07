import express from "express";
import { applyRetailer } from "./retailer.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { roleMiddleware } from "../../middlewares/role.middleware.js";

const router = express.Router();

 
router.post(
  "/apply",
  authMiddleware,
  roleMiddleware("CUSTOMER"),
  applyRetailer
);

export default router;
