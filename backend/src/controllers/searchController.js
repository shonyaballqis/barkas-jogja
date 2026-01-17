import db from "../config/db.js";

export const search = async (req, res) => {
  try {
    console.log("QUERY:", req.query);

    const keyword = req.query.q;

    if (!keyword) {
      return res.status(400).json({
        message: "Query pencarian (q) wajib diisi"
      });
    }

    const [products] = await db.execute(
      `
      SELECT p.product_id, p.name, p.price
      FROM products p
      WHERE p.is_active = TRUE
      AND p.name LIKE ?
      `,
      [`%${keyword}%`]
    );

    res.json({ products });

  } catch (error) {
    console.error("SEARCH ERROR DETAIL:", error); // PENTING
    res.status(500).json({ message: "Server error" });
  }
};
