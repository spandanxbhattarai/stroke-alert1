import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { loginSchema } from "@strokealert/shared";

const router = Router();

router.post("/login", validate(loginSchema), authController.login);
router.post("/logout", authController.logout);
router.get("/me", authMiddleware, authController.me);

export default router;
