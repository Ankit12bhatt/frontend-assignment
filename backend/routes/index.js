import { Router } from "express";
const router = Router();
import auth from "./auth.js";
import user from "./user.js";
import leave from "./leave.js";
router.use("/auth", auth);
router.use("/user", user);
router.use("/leave", leave);

export default router;
