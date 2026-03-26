import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../lib/jwt";

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ success: false, error: "Authentication required" });
    return;
  }

  try {
    const decoded = verifyToken(token);
    (req as any).admin = decoded;
    next();
  } catch {
    res.status(401).json({ success: false, error: "Invalid or expired token" });
  }
}
