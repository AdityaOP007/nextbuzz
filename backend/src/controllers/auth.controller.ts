import { Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../db/prisma";
import { signToken } from "../utils";
import { AuthRequest } from "../types";
import { RegisterInput, LoginInput, UpdateProfileInput } from "../validators";

const SALT_ROUNDS = 12;

function sanitizeUser(user: {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string;
  phone: string | null;
  city: string | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    city: user.city,
    name: [user.firstName, user.lastName].filter(Boolean).join(" "),
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export async function register(req: AuthRequest, res: Response): Promise<void> {
  console.log("POST /api/auth/register — Request Body:", req.body);
  const data = req.body as RegisterInput;

  console.log("Checking if email exists:", data.email);
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    res.status(409).json({ success: false, error: "Email already registered" });
    return;
  }

  const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);
  console.log("Creating user...");
  const user = await prisma.user.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName || null,
      email: data.email,
      phone: data.phone || null,
      city: data.city || null,
      passwordHash,
    },
  });
  console.log("User created:", { id: user.id, email: user.email });

  const token = signToken({ userId: user.id, email: user.email });
  res.status(201).json({
    success: true,
    data: { user: sanitizeUser(user), token },
    message: "Account created successfully",
  });
}

export async function login(req: AuthRequest, res: Response): Promise<void> {
  console.log("POST /api/auth/login — Request Body:", req.body);
  const data = req.body as LoginInput;

  console.log("Looking up user:", data.email);
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user) {
    res.status(401).json({ success: false, error: "Invalid email or password" });
    return;
  }

  const valid = await bcrypt.compare(data.password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ success: false, error: "Invalid email or password" });
    return;
  }

  const token = signToken({ userId: user.id, email: user.email });
  res.json({
    success: true,
    data: { user: sanitizeUser(user), token },
    message: "Login successful",
  });
}

export async function getMe(req: AuthRequest, res: Response): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
  });

  if (!user) {
    res.status(404).json({ success: false, error: "User not found" });
    return;
  }

  res.json({ success: true, data: sanitizeUser(user) });
}

export async function updateProfile(req: AuthRequest, res: Response): Promise<void> {
  console.log("PUT /api/auth/profile — Request Body:", req.body);
  const data = req.body as UpdateProfileInput;

  console.log("Updating profile for user:", req.user!.userId);
  const user = await prisma.user.update({
    where: { id: req.user!.userId },
    data: {
      ...(data.firstName !== undefined && { firstName: data.firstName }),
      ...(data.lastName !== undefined && { lastName: data.lastName }),
      ...(data.phone !== undefined && { phone: data.phone }),
      ...(data.city !== undefined && { city: data.city }),
    },
  });
  console.log("Profile updated:", { id: user.id, email: user.email });

  res.json({
    success: true,
    data: sanitizeUser(user),
    message: "Profile updated successfully",
  });
}
