import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { hospitalController } from "./controllers/hospital.controller";
import hospitalRoutes from "./routes/hospital.routes";
import authRoutes from "./routes/auth.routes";
import { errorMiddleware } from "./middleware/error.middleware";
import { authMiddleware } from "./middleware/auth.middleware";

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/auth", authRoutes);
app.get("/api/admin/stats", authMiddleware, hospitalController.getStats);

// Health check
app.get("/health", (_req, res) => res.json({ status: "ok", timestamp: new Date().toISOString() }));

// Error handler (must be last)
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`StrokeAlert API running on http://localhost:${PORT}`);
});

export default app;
