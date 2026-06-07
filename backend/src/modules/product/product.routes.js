import express from "express";
import { addProduct, getProducts, getProductDetail } from "./product.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { roleMiddleware } from "../../middlewares/role.middleware.js";
import { validateBody } from "../../middlewares/validate.middleware.js";
import { createProductSchema } from "./product.validation.js";

const router = express.Router();
 
router.post(
  "/",
  authMiddleware,
  roleMiddleware("RETAILER"),
  validateBody(createProductSchema),
  addProduct
);

 
router.get("/", getProducts);
router.get("/:id", getProductDetail);

export default router;
