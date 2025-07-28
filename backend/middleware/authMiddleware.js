import jwt from "jsonwebtoken";
import { HttpStatus } from "../utils/constants.js";
import { SECRETKEY } from "../config/environmentConfig.js";

// Middleware to verify token
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(HttpStatus.UNAUTHORIZED).json({ status: false, message: "Access token required" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRETKEY);
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(401).json({ status: false, message: "Invalid or expired token" });
  }
};

// Middleware to allow only admin users
export const isAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(HttpStatus.FORBIDDEN).json({ status: false, message: "Access denied: Admins only" });
  }
  next();
};
