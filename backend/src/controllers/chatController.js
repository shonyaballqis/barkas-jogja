import db from "../config/db.js";

/**
 * Kirim pesan (buyer ↔ seller)
 * Body: { seller_id, product_id, message }
 */
export const sendMessage = async (req, res) => {
  try {
    const sender_id = req.user.user_id;
    const { seller_id, product_id, message } = req.body;

    if (!seller_id || !message) {
      return res.status(400).json({ message: "seller_id dan message wajib diisi" });
    }

    // 1. Cek apakah chat sudah ada
    const [chatRows] = await db.query(
      `SELECT chat_id FROM chats
       WHERE buyer_id = ? AND seller_id = ? AND product_id = ?`,
      [sender_id, seller_id, product_id || null]
    );

    let chat_id;

    // 2. Kalau belum ada, buat chat baru
    if (chatRows.length === 0) {
      const [chatResult] = await db.query(
        `INSERT INTO chats (buyer_id, seller_id, product_id)
         VALUES (?, ?, ?)`,
        [sender_id, seller_id, product_id || null]
      );
      chat_id = chatResult.insertId;
    } else {
      chat_id = chatRows[0].chat_id;
    }

    // 3. Simpan pesan
    const [messageResult] = await db.query(
      `INSERT INTO chat_messages (chat_id, sender_id, message)
       VALUES (?, ?, ?)`,
      [chat_id, sender_id, message]
    );

    return res.status(201).json({
      message: "Pesan berhasil dikirim",
      data: {
        chat_id,
        message_id: messageResult.insertId,
        sender_id,
        message,
      },
    });
  } catch (error) {
    console.error("Send Message Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
