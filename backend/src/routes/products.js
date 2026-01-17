import express from "express";
import db from "../config/db.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";
import uploadProductImage from "../middlewares/uploadProductImage.js";
import isProductOwner from "../middlewares/isProductOwner.js";

const router = express.Router();

/**
 * ======================
 * GET PRODUCTS (PUBLIC)
 * buyer, seller, admin
 * ======================
 */
router.get("/", async (req, res) => {
  const [rows] = await db.execute(
    `SELECT p.*, u.name AS seller_name
     FROM products p
     JOIN users u ON p.user_id = u.user_id
     WHERE p.is_active = TRUE
       AND p.expired_at > NOW()`
  );

  res.json(rows);
});

/**
 * GET PRODUCT DETAIL
 */
router.get("/:id", async (req, res) => {
  const [product] = await db.execute(
    `SELECT * FROM products
     WHERE product_id = ? AND is_active = TRUE`,
    [req.params.id]
  );

  if (product.length === 0) {
    return res.status(404).json({ message: "Produk tidak ditemukan" });
  }

  const [images] = await db.execute(
    `SELECT image_url, is_primary
     FROM product_images
     WHERE product_id = ?`,
    [req.params.id]
  );

  res.json({
    ...product[0],
    images
  });
});

/**
 * ======================
 * CREATE PRODUCT
 * seller & admin
 * ======================
 */
router.post(
  "/",
  authMiddleware,
  roleMiddleware("seller", "admin"),
  uploadProductImage.single("image"),
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

      if (!name || !price || !stock) {
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

      // INSERT PRODUCT
      const [result] = await db.execute(
        `INSERT INTO products
         (user_id, name, description, price, category_id, product_condition, stock, expired_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
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

      // INSERT IMAGE (JIKA ADA)
      if (req.file) {
        await db.execute(
          `INSERT INTO product_images (product_id, image_url, is_primary)
           VALUES (?, ?, TRUE)`,
          [productId, `/uploads/products/${req.file.filename}`]
        );
      }

      res.status(201).json({
        message: "Produk berhasil ditambahkan"
      });

    } catch (error) {
      console.error("CREATE PRODUCT ERROR:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);




/**
 * ======================
 * UPDATE PRODUCT
 * seller (owner) & admin
 * ======================
 */
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("seller", "admin"),
  isProductOwner,
  uploadProductImage.single("image"),
  async (req, res) => {
    try {
      const { name, description, price, stock } = req.body;

      if (price && price <= 0) {
        return res.status(400).json({ message: "Price tidak valid" });
      }

     await db.execute(
  `UPDATE products
   SET name = ?, description = ?, price = ?, stock = ?
   WHERE product_id = ?`,
  [
    name,
    description,
    price,
    stock,
    req.params.id
  ]
);

      res.json({ message: "Produk berhasil diupdate" });

    } catch (error) {
      console.error("UPDATE PRODUCT ERROR:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);


/**
 * ======================
 * DELETE PRODUCT
 * seller (owner) & admin
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
        `UPDATE products SET is_active = FALSE WHERE product_id = ?`,
        [req.params.id]
      );

      res.json({ message: "Produk dinonaktifkan" });

    } catch (error) {
      console.error("DELETE PRODUCT ERROR:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);


/**
 * ======================
 * UPLOAD MULTIPLE IMAGES
 * ======================
 */
router.post(
  "/:id/images",
  authMiddleware,
  roleMiddleware("seller", "admin"),
  isProductOwner,
  uploadProductImage.array("images", 5),
  async (req, res) => {
    for (const file of req.files) {
      await db.execute(
        `INSERT INTO product_images (product_id, image_url)
         VALUES (?, ?)`,
        [req.params.id, `/uploads/products/${file.filename}`]
      );
    }

    res.json({ message: "Gambar produk berhasil diupload" });
  }
);

/**
 * SET PRIMARY IMAGE
 */
router.put(
  "/:productId/images/:imageId/primary",
  authMiddleware,
  roleMiddleware("seller", "admin"),
  isProductOwner,
  async (req, res) => {
    await db.execute(
      `UPDATE product_images SET is_primary = FALSE
       WHERE product_id = ?`,
      [req.params.productId]
    );

    await db.execute(
      `UPDATE product_images SET is_primary = TRUE
       WHERE image_id = ?`,
      [req.params.imageId]
    );

    res.json({ message: "Primary image updated" });
  }
);

export default router;
