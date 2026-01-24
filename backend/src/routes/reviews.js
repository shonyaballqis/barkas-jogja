import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  createReview,
  getProductReviews
} from "../controllers/reviewController.js";

const router = express.Router();

// buyer only
router.post("/", authMiddleware, createReview);

// public
router.get("/product/:productId", getProductReviews);

export default router;
