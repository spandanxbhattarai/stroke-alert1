import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service";

export const authController = {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);

      res.cookie("token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.json({
        success: true,
        data: { admin: result.admin, token: result.token },
        message: "Login successful",
      });
    } catch (err) {
      if ((err as Error).message === "Invalid credentials") {
        res.status(401).json({ success: false, error: "Invalid email or password" });
        return;
      }
      next(err);
    }
  },

  async logout(_req: Request, res: Response) {
    res.clearCookie("token");
    res.json({ success: true, message: "Logged out successfully" });
  },

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      const admin = await authService.getMe((req as any).admin.id);
      res.json({ success: true, data: admin });
    } catch (err) {
      next(err);
    }
  },
};
