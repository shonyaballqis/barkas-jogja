import express from "express";
import db from "../config/db.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * =========================
 * APPLY SELLER
 * POST /api/seller/apply
 * =========================
 */
router.post("/apply", authMiddleware, async (req, res) => {
  console.log("SELLER APPLY ROUTE HIT");
  console.log("USER:", req.user);
  console.log("BODY:", req.body);

  try {
    const { store_name, ktp_number } = req.body;
    const userId = req.user.user_id;

    if (!store_name || !ktp_number) {
      return res.status(400).json({
        message: "store_name dan ktp_number wajib diisi"
      });
    }

    if (req.user.role === "seller") {
      return res.status(400).json({
        message: "Kamu sudah menjadi seller"
      });
    }

    const [exist] = await db.execute(
      "SELECT verification_id FROM seller_verifications WHERE user_id = ?",
      [userId]
    );

    if (exist.length > 0) {
      return res.status(400).json({
        message: "Pengajuan seller sudah ada"
      });
    }

    await db.execute(
      `INSERT INTO seller_verifications (user_id, store_name, ktp_number, status)
       VALUES (?, ?, ?, 'pending')`,
      [userId, store_name, ktp_number]
    );

    return res.json({
      message: "Pengajuan seller berhasil, menunggu verifikasi admin"
    });

  } catch (err) {
    console.error("SELLER APPLY ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * =========================
 * GET SELLER STATUS
 * GET /api/seller/status
 * =========================
 */
router.get("/status", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.user_id;

    const [rows] = await db.execute(
      "SELECT status FROM seller_verifications WHERE user_id = ?",
      [userId]
    );

    if (rows.length === 0) {
      return res.json({ status: "not_registered" });
    }

    return res.json({ status: rows[0].status });

  } catch (err) {
    console.error("SELLER STATUS ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
