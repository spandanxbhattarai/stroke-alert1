import { Request, Response, NextFunction } from "express";
import { hospitalService } from "../services/hospital.service";

export const hospitalController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { city, search, page, pageSize } = req.query as any;
      const result = await hospitalService.getAll({ city, search, page: Number(page) || 1, pageSize: Number(pageSize) || 20 });
      res.json({
        success: true,
        data: result.hospitals,
        pagination: {
          page: Number(page) || 1,
          pageSize: Number(pageSize) || 20,
          total: result.total,
          totalPages: Math.ceil(result.total / (Number(pageSize) || 20)),
        },
      });
    } catch (err) {
      next(err);
    }
  },

  async getNearest(req: Request, res: Response, next: NextFunction) {
    try {
      const { lat, lng, limit } = req.query as any;
      if (!lat || !lng) {
        res.status(400).json({ success: false, error: "lat and lng are required" });
        return;
      }
      const hospitals = await hospitalService.getNearest(
        parseFloat(lat),
        parseFloat(lng),
        parseInt(limit) || 5
      );
      res.json({ success: true, data: hospitals });
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const hospital = await hospitalService.getById(req.params.id);
      res.json({ success: true, data: hospital });
    } catch (err) {
      if ((err as Error).message === "Hospital not found") {
        res.status(404).json({ success: false, error: "Hospital not found" });
        return;
      }
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const hospital = await hospitalService.create(req.body);
      res.status(201).json({ success: true, data: hospital, message: "Hospital created successfully" });
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const hospital = await hospitalService.update(req.params.id, req.body);
      res.json({ success: true, data: hospital, message: "Hospital updated successfully" });
    } catch (err) {
      if ((err as Error).message === "Hospital not found") {
        res.status(404).json({ success: false, error: "Hospital not found" });
        return;
      }
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await hospitalService.delete(req.params.id);
      res.json({ success: true, message: "Hospital deleted successfully" });
    } catch (err) {
      if ((err as Error).message === "Hospital not found") {
        res.status(404).json({ success: false, error: "Hospital not found" });
        return;
      }
      next(err);
    }
  },

  async toggleStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { isActive } = req.body;
      const hospital = await hospitalService.toggleStatus(req.params.id, isActive);
      res.json({ success: true, data: hospital, message: `Hospital ${isActive ? "activated" : "deactivated"}` });
    } catch (err) {
      next(err);
    }
  },

  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await hospitalService.getStats();
      res.json({ success: true, data: stats });
    } catch (err) {
      next(err);
    }
  },
};
