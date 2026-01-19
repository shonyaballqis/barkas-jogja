import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { addToCart, getCart } from "../controllers/cartController.js";

const router = express.Router();

router.post("/", authMiddleware, addToCart);
router.get("/", authMiddleware, getCart);

export default router;
