import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../env.config.js";

export function validateToken(req, res, next) {
  try {
    const bearerToken = req.headers.authorization;
    const token = bearerToken.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({
      message: "Invalid token",
    });
  }
}

export function validateAdmin(req, res, next) {
  const { role } = req.user;
  if (role !== "admin") {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
  next();
}
