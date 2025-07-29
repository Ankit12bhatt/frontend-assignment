import { PrismaClient } from "@prisma/client";
import { differenceInDays } from "date-fns";
import { HttpStatus } from "../utils/constants.js";
import { userMessage } from "../utils/message.js";
import { successResponse, errorResponse } from "../utils/responseHandler.js";

const prisma = new PrismaClient();

export const submitLeaveRequest = async (req, res) => {
    const userId = req.user.id;
    const { leave_type_id, start_date, end_date, reason, comments } = req.body;

    if (!leave_type_id || !start_date || !end_date || !reason) {
      return errorResponse(res, HttpStatus.BAD_REQUEST, "Leave type, dates, and reason are required");
    }

    const totalDays = differenceInDays(new Date(end_date), new Date(start_date)) + 1;

    if (totalDays <= 0) {
      return errorResponse(res, HttpStatus.BAD_REQUEST, "End date must be after start date");
    }

    const leaveType = await prisma.leaveType.findFirst({
      where: { id: leave_type_id, is_active: true },
    });

    if (!leaveType) {
      return errorResponse(res, HttpStatus.BAD_REQUEST, "Invalid leave type");
    }

    if (totalDays > leaveType.max_days) {
      return errorResponse(res, HttpStatus.BAD_REQUEST, `Cannot request more than ${leaveType.max_days} days for this leave type`);
    }

    const overlapping = await prisma.leaveRequest.findMany({
      where: {
        user_id: userId,
        status: { in: ["pending", "approved"] },
        OR: [
          {
            start_date: { lte: new Date(start_date) },
            end_date: { gte: new Date(start_date) },
          },
          {
            start_date: { lte: new Date(end_date) },
            end_date: { gte: new Date(end_date) },
          },
          {
            start_date: { gte: new Date(start_date) },
            end_date: { lte: new Date(end_date) },
          },
        ],
      },
    });

    if (overlapping.length > 0) {
      return errorResponse(res, HttpStatus.BAD_REQUEST, "You have overlapping leave requests");
    }

    const request = await prisma.leaveRequest.create({
      data: {
        user_id: userId,
        leave_type_id,
        start_date: new Date(start_date),
        end_date: new Date(end_date),
        total_days: totalDays,
        reason,
        comments,
      },
    });

    return successResponse(res, HttpStatus.CREATED, "Leave request submitted successfully", { requestId: request.id });
};


export const updateLeaveRequestStatus = async (req, res) => {
    const { requestId } = req.params;
    const { status, admin_comments } = req.body;
    const adminId = req.user.id;

    if (!["approved", "rejected"].includes(status)) {
        return errorResponse(res, HttpStatus.BAD_REQUEST, "Status must be approved or rejected");
    }

    const request = await prisma.leaveRequest.findUnique({
      where: { id: Number(requestId) },
      select: { id: true, status: true },
    });

    if (!request) {
        return errorResponse(res, HttpStatus.NOT_FOUND, "Leave request not found");
    }

    if (request.status !== "pending") {
        return errorResponse(res, HttpStatus.BAD_REQUEST, "Leave request has already been processed");
    }

    await prisma.leaveRequest.update({
      where: { id: Number(requestId) },
      data: {
        status,
        admin_comments,
        approved_by: adminId,
        approved_at: new Date(),
      },
    });

    res.json({
      success: true,
      message: `Leave request ${status} successfully`,
    });

};


export const getLeaveTypes = async (req, res) => {
    const leaveTypes = await prisma.leaveType.findMany({
      where: {
        is_active: true,
      },
      orderBy: [
        { type: 'asc' },
        { name: 'asc' },
      ],
    });

    res.status(HttpStatus.OK).json({
      success: true,
      data: leaveTypes,
    });
};


export const createLeaveType = async (req, res) => {
    const { name, type, max_days, color, description } = req.body;

    // Validate input
    if (!name || !type) {
      return res.status(400).json({
        success: false,
        message: "Name and type are required",
      });
    }

    // Check if leave type already exists
    const existing = await prisma.leaveType.findFirst({
      where: { name },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Leave type with this name already exists",
      });
    }

    // Insert leave type
    const newLeaveType = await prisma.leaveType.create({
      data: {
        name,
        type,
        max_days: max_days ?? 21,
        color: color ?? "#3b82f6",
        description,
      },
    });

    res.status(HttpStatus.CREATED).json({
      success: true,
      message: "Leave type created successfully",
      data: {
        leaveTypeId: newLeaveType.id,
      },
    });
};
