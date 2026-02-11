// This handles the "Business Logic": Find or Create a user.
import { PrismaClient } from "@prisma/client";
import { signToken } from "../../utils/jwt.js";

const prisma = new PrismaClient();

// 1. Register Logic
export const register = async (phone) => {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { phone },
  });

  if (existingUser) {
    throw new Error("User already exists. Please login.");
  }

  // Create new user
  const user = await prisma.user.create({
    data: { 
      phone,
      role: 'FARMER',
      language: 'en'
    },
  });

  const token = signToken(user.id);
  
  return { user, token };
};

// 2. Login Logic
export const login = async (phone) => {
  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { phone },
  });

  if (!user) {
    throw new Error("User not found. Please register first.");
  }

  const token = signToken(user.id);
  
  return { user, token };
};