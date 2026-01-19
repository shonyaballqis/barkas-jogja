import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { checkout } from "../controllers/checkoutController.js";

const router = express.Router();

router.post("/", authMiddleware, checkout);

export default router;
