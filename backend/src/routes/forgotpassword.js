import express from "express";
import crypto from "crypto";
import bcrypt from "bcrypt";
import db from "../config/db.js";

const router = express.Router();

/* =====================
   FORGOT PASSWORD
===================== */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const [users] = await db.execute(
      "SELECT user_id FROM users WHERE email = ?",
      [email]
    );

    // response dibuat sama walau email tidak ada (security)
    if (!users.length) {
      return res.json({
        message: "Jika email terdaftar, link reset akan dikirim"
      });
    }

    const token = crypto.randomBytes(32).toString("hex");

    await db.execute(
      `INSERT INTO password_resets (user_id, token, expired_at)
       VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 15 MINUTE))`,
      [users[0].user_id, token]
    );

    // TODO: kirim email reset password
    // link contoh:
    // http://localhost:5173/reset-password/${token}

    res.json({
      message: "Link reset password berhasil dikirim"
    });

  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================
   RESET PASSWORD
===================== */
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        message: "Token dan password wajib diisi"
      });
    }

    const [rows] = await db.execute(
      `SELECT id, user_id FROM password_resets
       WHERE token = ?
       AND used = FALSE
       AND expired_at > NOW()`,
      [token]
    );

    if (!rows.length) {
      return res.status(400).json({
        message: "Token tidak valid atau kadaluarsa"
      });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await db.execute(
      "UPDATE users SET password_hash = ? WHERE user_id = ?",
      [hashed, rows[0].user_id]
    );

    await db.execute(
      "UPDATE password_resets SET used = TRUE WHERE id = ?",
      [rows[0].id]
    );

    res.json({
      message: "Password berhasil direset"
    });

  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
