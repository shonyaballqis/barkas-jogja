import db from "../config/db.js";


class Cart {

  static async add(user_id, product_id, quantity, conn = db) {
    // lock product row
    const [[product]] = await conn.execute(
      `SELECT stock FROM products
       WHERE product_id = ?
       FOR UPDATE`,
      [product_id]
    );

    if (!product) {
      throw new Error("Produk tidak ditemukan");
    }

    if (quantity > product.stock) {
      throw new Error("Stock tidak mencukupi");
    }

    const [existing] = await conn.execute(
      `SELECT quantity FROM carts
       WHERE user_id = ? AND product_id = ?`,
      [user_id, product_id]
    );

    if (existing.length) {
      const newQty = existing[0].quantity + quantity;
      if (newQty > product.stock) {
        throw new Error("Stock tidak mencukupi");
      }

      await conn.execute(
        `UPDATE carts
         SET quantity = ?
         WHERE user_id = ? AND product_id = ?`,
        [newQty, user_id, product_id]
      );
    } else {
      await conn.execute(
        `INSERT INTO carts (user_id, product_id, quantity)
         VALUES (?, ?, ?)`,
        [user_id, product_id, quantity]
      );
    }
  }

  static async getByUser(user_id, conn = db) {
    const [rows] = await conn.execute(
      `SELECT c.cart_id, c.quantity,
              p.product_id, p.name, p.price, p.stock
       FROM carts c
       JOIN products p ON c.product_id = p.product_id
       WHERE c.user_id = ?`,
      [user_id]
    );
    return rows;
  }

  static async clear(user_id, conn = db) {
    await conn.execute(
      `DELETE FROM carts WHERE user_id = ?`,
      [user_id]
    );
  }
}

export default Cart;
