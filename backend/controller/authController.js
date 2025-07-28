import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SECRETKEY } from "../config/environmentConfig.js";
import { HttpStatus } from "../utils/constants.js";
import { userMessage } from "../utils/message.js";
import { successResponse, errorResponse } from "../utils/responseHandler.js";

const prisma = new PrismaClient();

// REGISTER
export const register = async (req, res) => {
  const {
    name,
    email,
    password,
    role = "employee",
    department,
    position,
    employee_id,
    phone,
    is_active = true,
  } = req.body;

  if (!name || !email || !password) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .json(errorResponse("Name, email, and password are required"));
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (existingUser) {
    return res
      .status(HttpStatus.CONFLICT)
      .json(errorResponse("Email already in use"));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      department,
      position,
      employee_id,
      phone,
      is_active,
    },
  });

  return res
    .status(HttpStatus.CREATED)
    .json(
      successResponse(
        { id: newUser.id, email: newUser.email },
        "User registered successfully"
      )
    );
};

// LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .json(errorResponse("Email and password are required"));
  }

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user || !user.is_active) {
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json(errorResponse(userMessage.UNAUTHORIZED));
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json(errorResponse(userMessage.UNAUTHORIZED));
  }

  const tokenPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(tokenPayload, SECRETKEY, {
    expiresIn: "24h",
  });

  return res
    .status(HttpStatus.OK)
    .json(successResponse({ token }, userMessage.LOGIN));
};
