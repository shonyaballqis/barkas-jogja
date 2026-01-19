import db from "../config/db.js";

export const sellerDashboard = async (req, res) => {
  try {
    const sellerId = req.user.user_id;

    // Total produk milik seller
    const [[products]] = await db.execute(
      `SELECT COUNT(*) AS total
       FROM products
       WHERE user_id = ?`,
      [sellerId]
    );

    // Total order unik (hindari double count)
    const [[orders]] = await db.execute(
      `SELECT COUNT(DISTINCT o.order_id) AS total
       FROM orders o
       JOIN order_items oi ON o.order_id = oi.order_id
       JOIN products p ON oi.product_id = p.product_id
       WHERE p.user_id = ?`,
      [sellerId]
    );

    // Total revenue (hanya order selesai)
    const [[revenue]] = await db.execute(
      `SELECT IFNULL(SUM(oi.price * oi.quantity), 0) AS total
       FROM orders o
       JOIN order_items oi ON o.order_id = oi.order_id
       JOIN products p ON oi.product_id = p.product_id
       WHERE p.user_id = ?
         AND o.status = 'completed'`,
      [sellerId]
    );

    // 5 order terakhir
    const [recentOrders] = await db.execute(
      `SELECT 
          o.order_id,
          o.created_at,
          o.status,
          SUM(oi.quantity) AS total_items,
          SUM(oi.price * oi.quantity) AS total_price
       FROM orders o
       JOIN order_items oi ON o.order_id = oi.order_id
       JOIN products p ON oi.product_id = p.product_id
       WHERE p.user_id = ?
       GROUP BY o.order_id
       ORDER BY o.created_at DESC
       LIMIT 5`,
      [sellerId]
    );

    res.json({
      total_products: products.total,
      total_orders: orders.total,
      total_revenue: revenue.total,
      recent_orders: recentOrders
    });

  } catch (error) {
    console.error("SELLER DASHBOARD ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
