import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/auth";

export const authMiddleware = (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send("Unauthorized");

  const token = authHeader.split(" ")[1];
  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(403).send("Invalid token");
  }
};
