import db from "../config/db.js";

class Order {

  static async create(user_id, total_price, conn = db) {
    const [result] = await conn.execute(
      `INSERT INTO orders (user_id, total_price, status)
       VALUES (?, ?, 'PAID')`,
      [user_id, total_price]
    );
    return result.insertId;
  }

  static async addItem(order_id, product_id, quantity, price, conn = db) {
    await conn.execute(
      `INSERT INTO order_items
       (order_id, product_id, quantity, price)
       VALUES (?, ?, ?, ?)`,
      [order_id, product_id, quantity, price]
    );
  }

  static async reduceStock(product_id, qty, conn = db) {
    const [result] = await conn.execute(
      `UPDATE products
       SET stock = stock - ?
       WHERE product_id = ? AND stock >= ?`,
      [qty, product_id, qty]
    );

    if (result.affectedRows === 0) {
      throw new Error("Stock berubah, silakan ulangi checkout");
    }
  }
}

export default Order;
