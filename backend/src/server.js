import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import db from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import forgotPasswordRoutes from "./routes/forgotpassword.js";
import userRoutes from "./routes/userRoutes.js";
import sellerRoutes from "./routes/sellerRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import productsRoutes from "./routes/products.js";
import cartRoutes from "./routes/cartRoutes.js";
import checkoutRoutes from "./routes/checkoutRoutes.js";
import dashboardRoutes from "./routes/dashboard.js";
import searchRoutes from "./routes/search.js";
import chatRoutes from "./routes/chatRoutes.js";

const app = express();

/* =====================
   DATABASE
===================== */
db.getConnection()
  .then(() => console.log("MySQL Connected"))
  .catch((err) => console.log("MySQL Error:", err));

/* =====================
   MIDDLEWARE
===================== */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =====================
   ROUTES 
===================== */
app.use("/api/auth", authRoutes);
app.use("/api/auth", forgotPasswordRoutes);

app.use("/api/user", userRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/admin", adminRoutes);

app.use("/api/products", productsRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/chat", chatRoutes);

/* =====================
   STATIC FILES
===================== */


app.use("/uploads", express.static("public/uploads"));


/* =====================
   SERVER
===================== */
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
