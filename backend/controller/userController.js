import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { HttpStatus } from "../utils/constants.js";
import { userMessage } from "../utils/message.js";
import { successResponse, errorResponse } from "../utils/responseHandler.js";

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

// @desc    Add a new user (Admin only)
// @route   POST /api/v1/user
export const addUser = async (req, res) => {
  const { name, email, password, role = "user", ...rest } = req.body;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res
      .status(HttpStatus.CONFLICT)
      .json(errorResponse(null, userMessage.USER_ALREADY_EXISTS));
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
      ...rest,
    },
  });

  return res
    .status(HttpStatus.CREATED)
    .json(
      successResponse(
        { id: newUser.id, email: newUser.email },
        userMessage.USER_CREATED
      )
    );
};

// @desc    Get all users (Admin only)
// @route   GET /api/v1/user
export const getAllUsers = async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      is_active: true,
      employee_id: true,
      department: true,
      position: true,
      created_at: true,
    },
  });

  return res
    .status(HttpStatus.OK)
    .json(successResponse(users, userMessage.FETCHED_USERS));
};

// @desc    Get a single user by ID
// @route   GET /api/v1/user/:id
export const getUser = async (req, res) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: { id: parseInt(id) },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      is_active: true,
      employee_id: true,
      department: true,
      position: true,
      created_at: true,
    },
  });

  if (!user) {
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(errorResponse(null, userMessage.USER_NOT_FOUND));
  }

  return res
    .status(HttpStatus.OK)
    .json(successResponse(user, userMessage.USER_FETCHED));
};

// @desc    Update user (Admin only)
// @route   PUT /api/v1/user/:id
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  if (data.password) {
    data.password = await bcrypt.hash(data.password, SALT_ROUNDS);
  }

  const updatedUser = await prisma.user.update({
    where: { id: parseInt(id) },
    data,
  });

  return res
    .status(HttpStatus.OK)
    .json(
      successResponse(
        { id: updatedUser.id, email: updatedUser.email },
        userMessage.USER_UPDATED
      )
    );
};

// @desc    Delete user (Admin only)
// @route   DELETE /api/v1/user/:id
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  await prisma.user.delete({
    where: { id: parseInt(id) },
  });

  return res
    .status(HttpStatus.OK)
    .json(successResponse(null, userMessage.USER_DELETED));
};

// @desc    Get current user (Authenticated user)
// @route   GET /api/v1/user/me
export const getCurrentUser = async (req, res) => {
  const userId = req.user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      is_active: true,
      employee_id: true,
      department: true,
      position: true,
      created_at: true,
    },
  });

  if (!user) {
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(errorResponse(null, userMessage.USER_NOT_FOUND));
  }

  return res
    .status(HttpStatus.OK)
    .json(successResponse(user, userMessage.CURRENT_USER_FETCHED));
}