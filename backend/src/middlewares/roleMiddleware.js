import e from "express";

export const roleMiddleware = (roles = []) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: "Role tidak ditemukan" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Akses ditolak" });
    }

    next();
  };
};


export default roleMiddleware;