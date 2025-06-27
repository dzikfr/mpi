import express from "express";
import { Router } from "express";
import path from "path";
import { errorHandler } from "./middlewares/errorHandler";
import { logger } from "./config/logger";
import { corsMiddleware } from "./config/cors";
import cors from "cors";

const app = express();
const router = Router();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(corsMiddleware);
app.use(cors())
app.use(logger);

// Static files
app.use(express.static(path.join(__dirname, "../public")));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Routes
import eventRoutes from "./modules/event/event.route";
import assetRoutes from "./modules/asset/asset.routes";
import authRoutes from "./modules/authenticate/auth.route";
import dynamicRoutes from "./modules/dynamic/dynamic.route";
import volunteerRoutes from "./modules/volunteer/volunteer.route";

router.use("/event", eventRoutes);
router.use("/asset", assetRoutes);
router.use("/volunteer", volunteerRoutes);
router.use("/auth", authRoutes);
router.use("/dynamic", dynamicRoutes);
app.use("/api", router);

// 404 Not Found
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "../public/not_found.html"));
});

// Global Error Handler
app.use(errorHandler);

export { app };
