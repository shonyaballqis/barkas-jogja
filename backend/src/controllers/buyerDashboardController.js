export const buyerDashboard = async (req, res) => {
  const userId = req.user.user_id;

  const [[orders]] = await db.execute(
    `SELECT COUNT(*) total FROM orders WHERE user_id = ?`,
    [userId]
  );

  const [[cart]] = await db.execute(
    `SELECT COUNT(*) total FROM carts WHERE user_id = ?`,
    [userId]
  );

  const [recentOrders] = await db.execute(
    `SELECT order_id, total_price, status, created_at
     FROM orders
     WHERE user_id = ?
     ORDER BY created_at DESC
     LIMIT 5`,
    [userId]
  );

  res.json({
    total_orders: orders.total,
    cart_items: cart.total,
    recent_orders: recentOrders
  });
};
