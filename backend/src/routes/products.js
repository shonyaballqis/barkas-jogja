import express from "express";
import db from "../config/db.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";
import uploadProductImage from "../middlewares/uploadProductImage.js";
import isProductOwner from "../middlewares/isProductOwner.js";

const router = express.Router();

/**
 * ======================
 * GET PRODUCTS (SELLER)  ✅ HARUS DI ATAS
 * ======================
 */
router.get(
  "/seller",
  authMiddleware,
  roleMiddleware("seller", "admin"),
  async (req, res) => {
    try {
      const [rows] = await db.execute(
        `
        SELECT 
          p.*,
          pi.image_url
        FROM products p
        LEFT JOIN product_images pi
          ON p.product_id = pi.product_id
          AND pi.is_primary = 1
        WHERE p.user_id = ?
          AND p.is_active = 1
          AND p.expired_at > NOW()
        ORDER BY p.created_at DESC
        `,
        [req.user.user_id]
      );

      res.json(rows);
    } catch (err) {
      console.error("GET SELLER PRODUCTS ERROR:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/**
 * ======================
 * GET PRODUCTS (PUBLIC)
 * ======================
 */
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.execute(
      `
      SELECT 
        p.*,
        u.name AS seller_name,
        pi.image_url
      FROM products p
      JOIN users u ON p.user_id = u.user_id
      LEFT JOIN product_images pi
        ON p.product_id = pi.product_id
        AND pi.is_primary = 1
      WHERE p.is_active = 1
        AND p.expired_at > NOW()
      `
    );

    res.json(rows);
  } catch (err) {
    console.error("GET PRODUCTS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * ======================
 * GET PRODUCT BY ID
 * ======================
 */
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("seller", "admin"),
  isProductOwner,
  async (req, res) => {
    try {
      const [rows] = await db.execute(
        `
        SELECT 
          p.*,
          pi.image_url
        FROM products p
        LEFT JOIN product_images pi
          ON p.product_id = pi.product_id
          AND pi.is_primary = 1
        WHERE p.product_id = ?
        `,
        [req.params.id]
      );

      if (rows.length === 0) {
        return res.status(404).json({
          message: "Produk tidak ditemukan"
        });
      }

      res.json(rows[0]);
    } catch (err) {
      console.error("GET PRODUCT DETAIL ERROR:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);


/**
 * ======================
 * CREATE PRODUCT
 * ======================
 */
router.post(
  "/",
  authMiddleware,
  roleMiddleware("seller", "admin"),

  // 🔥 WRAPPER MULTER (AMAN)
  (req, res, next) => {
    uploadProductImage.array("images", 5)(req, res, err => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },

  async (req, res) => {
    try {
      const {
        name,
        description,
        price,
        category_id,
        condition,
        stock
      } = req.body;

      if (!name || !price || stock === undefined) {
        return res.status(400).json({
          message: "Name, price, dan stock wajib diisi"
        });
      }

      if (price <= 0 || stock < 0) {
        return res.status(400).json({
          message: "Price atau stock tidak valid"
        });
      }

      const expiredAt = new Date();
      expiredAt.setDate(expiredAt.getDate() + 30);

      const [result] = await db.execute(
        `
        INSERT INTO products
        (user_id, name, description, price, category_id, product_condition, stock, expired_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          req.user.user_id,
          name,
          description || null,
          price,
          category_id || null,
          condition || null,
          stock,
          expiredAt
        ]
      );

      const productId = result.insertId;

      if (req.files?.length) {
        for (let i = 0; i < req.files.length; i++) {
          await db.execute(
            `
            INSERT INTO product_images (product_id, image_url, is_primary)
            VALUES (?, ?, ?)
            `,
            [
              productId,
              `/uploads/products/${req.files[i].filename}`,
              i === 0
            ]
          );
        }
      }

      res.status(201).json({ message: "Produk berhasil ditambahkan" });
    } catch (err) {
      console.error("CREATE PRODUCT ERROR:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/**
 * ======================
 * UPDATE PRODUCT
 * ======================
 */
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("seller", "admin"),
  isProductOwner,
  uploadProductImage.array("images", 5),
  async (req, res) => {
    try {
      const { name, description, price, stock } = req.body;

      if (price !== undefined && price <= 0) {
        return res.status(400).json({ message: "Price tidak valid" });
      }

      const fields = [];
      const values = [];

      if (name) {
        fields.push("name = ?");
        values.push(name);
      }
      if (description) {
        fields.push("description = ?");
        values.push(description);
      }
      if (price !== undefined) {
        fields.push("price = ?");
        values.push(price);
      }
      if (stock !== undefined) {
        fields.push("stock = ?");
        values.push(stock);
      }

      if (fields.length === 0) {
        return res.status(400).json({
          message: "Tidak ada data untuk diupdate"
        });
      }

      values.push(req.params.id);

      await db.execute(
        `UPDATE products SET ${fields.join(", ")} WHERE product_id = ?`,
        values
      );

      // setelah UPDATE products
if (req.files && req.files.length > 0) {
  // hapus gambar lama (opsional tapi disarankan)
  await db.execute(
    "DELETE FROM product_images WHERE product_id = ?",
    [req.params.id]
  );

  for (let i = 0; i < req.files.length; i++) {
    await db.execute(
      `INSERT INTO product_images (product_id, image_url, is_primary)
       VALUES (?, ?, ?)`,
      [
        req.params.id,
        `/uploads/products/${req.files[i].filename}`,
        i === 0
      ]
    );
  }
}


      res.json({ message: "Produk berhasil diupdate" });
    } catch (err) {
      console.error("UPDATE PRODUCT ERROR:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/**
 * ======================
 * DELETE PRODUCT (SOFT)
 * ======================
 */
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("seller", "admin"),
  isProductOwner,
  async (req, res) => {
    try {
      await db.execute(
        `UPDATE products SET is_active = 0 WHERE product_id = ?`,
        [req.params.id]
      );

      res.json({ message: "Produk dinonaktifkan" });
    } catch (err) {
      console.error("DELETE PRODUCT ERROR:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/**
 * ======================
 * UPLOAD ADDITIONAL IMAGES
 * ======================
 */
router.post(
  "/:id/images",
  authMiddleware,
  roleMiddleware("seller", "admin"),
  isProductOwner,
  uploadProductImage.array("images", 5),
  async (req, res) => {
    try {
      const [[{ total }]] = await db.execute(
        `SELECT COUNT(*) AS total FROM product_images WHERE product_id = ?`,
        [req.params.id]
      );

      if (total + req.files.length > 5) {
        return res.status(400).json({
          message: "Total gambar maksimal 5"
        });
      }

      for (const file of req.files) {
        await db.execute(
          `
          INSERT INTO product_images (product_id, image_url)
          VALUES (?, ?)
          `,
          [req.params.id, `/uploads/products/${file.filename}`]
        );
      }

      res.json({ message: "Gambar berhasil ditambahkan" });
    } catch (err) {
      console.error("UPLOAD IMAGE ERROR:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/**
 * ======================
 * SET PRIMARY IMAGE
 * ======================
 */
router.put(
  "/:productId/images/:imageId/primary",
  authMiddleware,
  roleMiddleware("seller", "admin"),
  isProductOwner,
  async (req, res) => {
    try {
      await db.execute(
        `UPDATE product_images SET is_primary = 0 WHERE product_id = ?`,
        [req.params.productId]
      );

      await db.execute(
        `UPDATE product_images SET is_primary = 1 WHERE image_id = ?`,
        [req.params.imageId]
      );

      res.json({ message: "Primary image updated" });
    } catch (err) {
      console.error("SET PRIMARY IMAGE ERROR:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
