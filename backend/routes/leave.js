import { Router } from "express";
import { asyncErrorHandler } from "../utils/errorHandler.js";
import { authenticate, isAdmin } from "../middleware/authMiddleware.js";
import { createLeaveType, getLeaveTypes, submitLeaveRequest, updateLeaveRequestStatus, deletLeaveType, getAppliedLeaves } from "../controller/leaveController.js";
const router = Router();

router.get("/", authenticate, asyncErrorHandler(getLeaveTypes));
router.post("/", authenticate, isAdmin, asyncErrorHandler(createLeaveType));
router.post("/request", authenticate, asyncErrorHandler(submitLeaveRequest));
router.put("/:id", authenticate, isAdmin, asyncErrorHandler(updateLeaveRequestStatus));
router.delete("/:leaveId", authenticate, isAdmin, asyncErrorHandler(deletLeaveType));
router.get("/myLeave", authenticate, asyncErrorHandler(getAppliedLeaves));

export default router;
