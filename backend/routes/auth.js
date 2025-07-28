import { Router } from "express";
import { asyncErrorHandler } from "../utils/errorHandler.js";
import { register, login } from "../controller/authController.js";
import { authenticate, isAdmin } from "../middleware/authMiddleware.js";
const router =Router();

router.post("/login", asyncErrorHandler(login));
router.post("/register", authenticate, isAdmin, asyncErrorHandler(register));
router.post("/init-admin", asyncErrorHandler(register));


export default router;