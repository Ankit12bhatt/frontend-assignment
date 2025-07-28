import { Router } from "express";
import { asyncErrorHandler } from "../utils/errorHandler.js";
import { authenticate, isAdmin } from "../middleware/authMiddleware.js";
import {
  addUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} from "../controller/userController.js";
const router = Router();

router.post("/", authenticate, isAdmin, asyncErrorHandler(addUser));
router.get("/", authenticate, isAdmin, asyncErrorHandler(getAllUsers));
router.get("/:id", authenticate, asyncErrorHandler(getUser));
router.put("/:id", authenticate, isAdmin, asyncErrorHandler(updateUser));
router.delete("/:id", authenticate, isAdmin, asyncErrorHandler(deleteUser));

export default router;
