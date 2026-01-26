import express from "express";
import db from "../config/db.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

/* =========================
   ADMIN ONLY MIDDLEWARE
========================= */
const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }
  next();
};

router.get("/test", (req, res) => {
  res.json({ ok: true });
});


/* =========================
   GET SELLER REQUESTS
========================= */
router.get(
  "/seller-requests",
  authMiddleware,
  adminOnly,
  async (req, res) => {
    try {
      const [rows] = await db.execute(`
        SELECT 
          sv.id AS verification_id,
          sv.user_id,
          u.name,
          u.email,
          sv.store_name,
          sv.status
        FROM seller_verifications sv
        JOIN users u ON sv.user_id = u.user_id
        WHERE sv.status = 'pending'
      `);

      res.json(rows);
    } catch (error) {
      console.error("GET SELLER REQUEST ERROR:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/* =========================
   APPROVE SELLER
========================= */
router.put(
  "/seller-requests/:id/approve",
  authMiddleware,
  adminOnly,
  async (req, res) => {
    const verificationId = req.params.id;
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      const [[seller]] = await connection.execute(
        "SELECT user_id FROM seller_verifications WHERE id = ? AND status = 'pending'",
        [verificationId]
      );

      if (!seller) {
        await connection.rollback();
        return res.status(404).json({ message: "Pengajuan tidak ditemukan" });
      }

      await connection.execute(
        "UPDATE seller_verifications SET status = 'approved' WHERE id = ?",
        [verificationId]
      );

      await connection.execute(
        "UPDATE users SET role = 'seller' WHERE user_id = ?",
        [seller.user_id]
      );

      await connection.commit();
      res.json({ message: "Seller berhasil disetujui" });
    } catch (error) {
      await connection.rollback();
      console.error("APPROVE SELLER ERROR:", error);
      res.status(500).json({ message: "Server error" });
    } finally {
      connection.release();
    }
  }
);

export default router;
