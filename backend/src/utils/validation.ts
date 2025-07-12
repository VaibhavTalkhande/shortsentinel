import { z } from "zod";

export const urlSchema = z.object({
  longUrl: z.string().url(),
  customCode: z.string().min(3).optional()
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});


export const loginSchema = registerSchema;