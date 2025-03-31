import jwt from "jsonwebtoken";

const verifyAdmin = (req, res, next) => {
  const user = req.user; // comes from verifyToken middleware

  if (user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden. Admins only." });
  }

  next();
};

export default verifyAdmin;
