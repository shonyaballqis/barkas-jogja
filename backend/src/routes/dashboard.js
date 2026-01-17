import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

import { adminDashboard } from "../controllers/adminDashboardController.js";
import { sellerDashboard } from "../controllers/sellerDashboardController.js";
import { buyerDashboard } from "../controllers/buyerDashboardController.js";

const router = express.Router();

/**
 * ======================
 * ADMIN DASHBOARD
 * ======================
 */
router.get(
  "/admin",
  authMiddleware,
  roleMiddleware("admin"),
  adminDashboard
);

/**
 * ======================
 * SELLER DASHBOARD
 * ======================
 */
router.get(
  "/seller",
  authMiddleware,
  roleMiddleware("seller"),
  sellerDashboard
);

/**
 * ======================
 * BUYER DASHBOARD
 * ======================
 */
router.get(
  "/buyer",
  authMiddleware,
  roleMiddleware("buyer"),
  buyerDashboard
);

export default router;
