import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createPool(process.env.DATABASE_URL);

// test koneksi
(async () => {
  try {
    const conn = await db.getConnection();
    console.log("Database connected to Railway");
    conn.release();
  } catch (err) {
    console.error("DB ERROR:", err.message);
  }
})();

export default db;
