import db from "../config/db.js";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";

export const checkout = async (req, res) => {
  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const user_id = req.user.user_id;

    // 1. Ambil cart + stock produk
    const cartItems = await Cart.getByUser(user_id, connection);

    if (!cartItems || cartItems.length === 0) {
      throw new Error("Cart kosong");
    }

    let total = 0;

    // 2. Validasi stock & hitung total
    for (const item of cartItems) {
      if (item.quantity > item.stock) {
        throw new Error(`Stock produk "${item.name}" tidak mencukupi`);
      }
      total += item.price * item.quantity;
    }

    // 3. Buat order
    const orderId = await Order.create(user_id, total, connection);

    // 4. Simpan order items + kurangi stock
    for (const item of cartItems) {
      await Order.addItem(
        orderId,
        item.product_id,
        item.quantity,
        item.price,
        connection
      );

      await Order.reduceStock(
        item.product_id,
        item.quantity,
        connection
      );
    }

    // 5. Kosongkan cart
    await Cart.clear(user_id, connection);

    await connection.commit();

    return res.status(201).json({
      message: "Checkout berhasil",
      order_id: orderId,
      total_price: total
    });

  } catch (error) {
    if (connection) await connection.rollback();

    console.error("CHECKOUT ERROR:", error);

    return res.status(400).json({
      message: error.message || "Checkout gagal"
    });

  } finally {
    if (connection) connection.release();
  }
};
