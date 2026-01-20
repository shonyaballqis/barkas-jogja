import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import {
  findByEmail,
  createUser,
  findByVerifyToken,
  verifyUser
} from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";

/**
 * REGISTER
 */
export const register = async (req, res) => {
  try {
    let { name, email, password } = req.body;
    email = email.trim().toLowerCase();

    const [exist] = await findByEmail(email);
    if (exist.length) {
      return res.status(400).json({ message: "Email sudah digunakan" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verifyToken = crypto.randomBytes(32).toString("hex");

    await createUser(name, email, hashedPassword, verifyToken);

    try {
      const link = `http://localhost:5000/api/auth/verify/${verifyToken}`;
      await sendEmail(
        email,
        "Verifikasi Email",
        `<p>Halo <b>${name}</b>,</p>
         <p>Klik link berikut untuk verifikasi akun kamu:</p>
         <a href="${link}">${link}</a>`
      );
    } catch (e) {
      console.log("Email gagal dikirim:", e.message);
    }

    return res.status(201).json({
      message: "Registrasi berhasil, silakan cek email untuk verifikasi"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * VERIFY EMAIL
 */
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const [users] = await findByVerifyToken(token);
    if (!users.length) {
      return res.status(400).json({ message: "Token tidak valid" });
    }

    await verifyUser(users[0].user_id);


    return res.json({ message: "Email berhasil diverifikasi" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
/**
 * LOGIN
 */
export const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email.trim().toLowerCase();

    const [users] = await findByEmail(email);
    if (!users.length) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    const user = users[0];

    if (!user.email_verified) {
      return res.status(403).json({ message: "Email belum diverifikasi" });
    }

    console.log("PLAIN  :", password);
    console.log("HASH   :", user.password_hash);

    const valid = await bcrypt.compare(password, user.password_hash);
    console.log("COMPARE:", valid);

    if (!valid) {
      return res.status(400).json({ message: "Password salah" });
    }

    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      message: "Login berhasil",
      token,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
