import express from "express";
import { PrismaClient } from "@prisma/client";
import { registerSchema, loginSchema } from "../utils/validation";
import { hashPassword, comparePassword, generateToken } from "../utils/auth";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/register", async (req, res) => {
  const result = registerSchema.safeParse(req.body);
  if (!result.success) return res.status(400).json(result.error.format());

  const { email, password } = result.data;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) return res.status(409).json({ message: "User already exists" });

  const hashed = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashed
    }
  });

  const token = generateToken(user.id);
  return res.status(201).json({ token });
});

router.post("/login", async (req, res) => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) return res.status(400).json(result.error.format());

  const { email, password } = result.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const isValid = await comparePassword(password, user.password);
  if (!isValid) return res.status(401).json({ message: "Invalid credentials" });

  const token = generateToken(user.id);
  return res.status(200).json({ token });
});

export default router;
