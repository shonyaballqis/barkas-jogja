import multer from "multer";
import fs from "fs";
import path from "path";

const uploadDir = path.join("public", "uploads", "products");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const uploadProductImage = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter(req, file, cb) {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("File harus gambar"), false);
    }
    cb(null, true);
  }
});

export default uploadProductImage;
