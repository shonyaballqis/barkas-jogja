import jwt from "jsonwebtoken";

console.log("JWT_SECRET:", process.env.JWT_SECRET);



export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ msg: "Token tidak ada" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token tidak valid" });
  }
};
export default authMiddleware;
