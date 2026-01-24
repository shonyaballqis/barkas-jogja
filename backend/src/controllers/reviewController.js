import db from "../config/db.js";

/**
 * CREATE REVIEW
 */
export const createReview = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { product_id, rating, comment } = req.body;

    if (!product_id || !rating) {
      return res.status(400).json({ message: "Product dan rating wajib diisi" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating harus 1 - 5" });
    }

    // cek apakah user pernah beli produk
    const [[order]] = await db.execute(
      `SELECT o.order_id
       FROM orders o
       JOIN order_items oi ON o.order_id = oi.order_id
       WHERE o.user_id = ?
         AND oi.product_id = ?
         AND o.status = 'completed'
       LIMIT 1`,
      [userId, product_id]
    );

    if (!order) {
      return res.status(403).json({
        message: "Kamu hanya bisa review produk yang sudah dibeli"
      });
    }

    await db.execute(
      `INSERT INTO reviews (product_id, user_id, rating, comment)
       VALUES (?, ?, ?, ?)`,
      [product_id, userId, rating, comment || null]
    );

    res.status(201).json({ message: "Review berhasil ditambahkan" });

  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "Kamu sudah mereview produk ini" });
    }

    console.error("CREATE REVIEW ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET REVIEW BY PRODUCT
 */
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const [reviews] = await db.execute(
      `SELECT r.review_id, r.rating, r.comment, r.created_at,
              u.name AS reviewer_name
       FROM reviews r
       JOIN users u ON r.user_id = u.user_id
       WHERE r.product_id = ?
       ORDER BY r.created_at DESC`,
      [productId]
    );

    res.json(reviews);

  } catch (error) {
    console.error("GET REVIEW ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
