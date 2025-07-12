import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/auth";
import { AuthRequest } from "../types/auth-request";

export const authMiddleware = (
  req: Request, // keep this generic for compatibility
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyToken(token); // returns { userId: string }

    // Cast req to AuthRequest and attach user
    (req as AuthRequest).user = { userId: payload.userId };

    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};
