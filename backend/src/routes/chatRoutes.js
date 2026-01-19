import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { sendMessage } from "../controllers/chatController.js";

const router = express.Router();

// Kirim pesan
router.post("/send", authMiddleware, sendMessage);

export default router;
