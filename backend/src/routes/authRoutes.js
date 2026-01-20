import express from "express";
import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../config/db.js";
import { sendEmail } from "../utils/mailer.js";
import { validatePassword } from "../utils/passwordValidator.js";

const router = express.Router();

/**
 * =========================
 * REGISTER
 * =========================
 */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, dan password wajib diisi"
      });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        message:
          "Password minimal 8 karakter, mengandung huruf besar, huruf kecil, dan angka"
      });
    }

    const [exist] = await db.execute(
      "SELECT user_id FROM users WHERE email = ?",
      [email]
    );

    if (exist.length) {
      return res.status(400).json({
        message: "Email sudah terdaftar"
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const [result] = await db.execute(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES (?, ?, ?, 'buyer')`,
      [name, email, hash]
    );

    const userId = result.insertId;
    const token = crypto.randomUUID();

    await db.execute(
      `INSERT INTO email_verifications (user_id, token, expired_at)
       VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 24 HOUR))`,
      [userId, token]
    );

    try {
      const link = `http://localhost:5000/api/auth/verify-email?token=${token}`;
      await sendEmail(email, "Verifikasi Email", link);
    } catch (err) {
      console.log("Email gagal dikirim:", err.message);
    }

    res.status(201).json({
      message: "Registrasi berhasil, silakan verifikasi email"
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * =========================
 * VERIFY EMAIL
 * =========================
 */
router.get("/verify-email", async (req, res) => {
  try {
    const { token } = req.query;

    const [rows] = await db.execute(
      `SELECT user_id FROM email_verifications
       WHERE token = ? AND expired_at > NOW()`,
      [token]
    );

    if (!rows.length) {
      return res.status(400).json({
        message: "Token tidak valid atau expired"
      });
    }

    const userId = rows[0].user_id;

    await db.execute(
      "UPDATE users SET email_verified = TRUE WHERE user_id = ?",
      [userId]
    );

    await db.execute(
      "DELETE FROM email_verifications WHERE user_id = ?",
      [userId]
    );

    res.json({ message: "Email berhasil diverifikasi" });

  } catch (error) {
    console.error("VERIFY ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * =========================
 * LOGIN (FINAL & FIXED)
 * =========================
 */
router.post("/login", async (req, res) => {

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email dan password wajib diisi"
      });
    }

    const [users] = await db.execute(
      `SELECT user_id, name, email, role, password_hash, email_verified
       FROM users
       WHERE email = ?`,
      [email]
    );

    if (!users.length) {
      return res.status(404).json({
        message: "User tidak ditemukan"
      });
    }

    const user = users[0];

    if (!user.email_verified) {
      return res.status(403).json({
        message: "Email belum diverifikasi"
      });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(400).json({
        message: "Password salah"
      });
    }

    const token = jwt.sign(
      {
        user_id: user.user_id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    /**
     * ⬅️ INI KUNCI UTAMA
     * Frontend kamu butuh user object
     */
    res.json({
      message: "Login berhasil",
      token,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
