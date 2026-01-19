import db from "../config/db.js";

export const createProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const sellerId = req.user.user_id;
    const image = req.file ? req.file.filename : null;

    if (!name || !price) {
      return res.status(400).json({
        message: "Nama dan harga wajib"
      });
    }

    await db.execute(
      `INSERT INTO products (seller_id, name, description, price, image)
       VALUES (?, ?, ?, ?, ?)`,
      [sellerId, name, description || null, price, image]
    );

    res.status(201).json({
      message: "Produk berhasil ditambahkan"
    });

  } catch (err) {
    console.error("CREATE PRODUCT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const productId = req.params.id;
    const sellerId = req.user.user_id;
    const image = req.file ? req.file.filename : null;

    if (!name || !price) {
      return res.status(400).json({
        message: "Nama dan harga wajib"
      });
    }

    let query = `
      UPDATE products
      SET name = ?, description = ?, price = ?
    `;
    const params = [name, description || null, price];

    if (image) {
      query += ", image = ?";
      params.push(image);
    }

    query += " WHERE id = ? AND seller_id = ?";
    params.push(productId, sellerId);

    const [result] = await db.execute(query, params);

    if (result.affectedRows === 0) {
      return res.status(403).json({
        message: "Tidak diizinkan atau produk tidak ditemukan"
      });
    }

    res.json({ message: "Produk berhasil diupdate" });

  } catch (err) {
    console.error("UPDATE PRODUCT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const sellerId = req.user.user_id;

    const [result] = await db.execute(
      "DELETE FROM products WHERE id = ? AND seller_id = ?",
      [productId, sellerId]
    );

    if (result.affectedRows === 0) {
      return res.status(403).json({
        message: "Tidak diizinkan atau produk tidak ditemukan"
      });
    }

    res.json({ message: "Produk berhasil dihapus" });

  } catch (err) {
    console.error("DELETE PRODUCT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.image,
        u.name AS seller_name
      FROM products p
      JOIN users u ON p.seller_id = u.user_id
      ORDER BY p.created_at DESC
    `);

    res.json(rows);

  } catch (err) {
    console.error("GET PRODUCTS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
