import Cart from "../models/Cart.js";

export const addToCart = async (req, res) => {
  try {
    const { product_id, quantity } = req.body;

    if (!product_id || !quantity) {
      return res.status(400).json({ message: "Data tidak lengkap" });
    }

    await Cart.add(req.user.user_id, product_id, quantity);

    res.status(201).json({ message: "Produk berhasil ditambahkan ke cart" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.getByUser(req.user.user_id);
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
