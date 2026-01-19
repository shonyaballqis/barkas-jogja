export const adminDashboard = async (req, res) => {
  try {
    const [[users]] = await db.execute(
      `SELECT COUNT(*) AS total FROM users`
    );

    const [[sellers]] = await db.execute(
      `SELECT COUNT(*) AS total FROM users WHERE role = 'seller'`
    );

    const [[buyers]] = await db.execute(
      `SELECT COUNT(*) AS total FROM users WHERE role = 'buyer'`
    );

    const [[products]] = await db.execute(
      `SELECT COUNT(*) AS total FROM products`
    );

    const [[orders]] = await db.execute(
      `SELECT COUNT(*) AS total FROM orders`
    );

    const [[revenue]] = await db.execute(
      `SELECT IFNULL(SUM(total_price), 0) AS total FROM orders`
    );

    res.json({
      total_users: users.total,
      total_sellers: sellers.total,
      total_buyers: buyers.total,
      total_products: products.total,
      total_orders: orders.total,
      total_revenue: revenue.total
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Admin dashboard error" });
  }
};
