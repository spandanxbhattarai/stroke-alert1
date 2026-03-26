import { Router } from "express";
import { hospitalController } from "../controllers/hospital.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { createHospitalSchema, updateHospitalSchema } from "@strokealert/shared";

const router = Router();

// Public routes
router.get("/", hospitalController.getAll);
router.get("/nearest", hospitalController.getNearest);
router.get("/:id", hospitalController.getById);

// Admin routes
router.post("/", authMiddleware, validate(createHospitalSchema), hospitalController.create);
router.put("/:id", authMiddleware, validate(updateHospitalSchema), hospitalController.update);
router.delete("/:id", authMiddleware, hospitalController.delete);
router.patch("/:id/status", authMiddleware, hospitalController.toggleStatus);

export default router;
