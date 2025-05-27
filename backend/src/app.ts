import express from "express";
import { errorHandler } from "./middlewares/errorHandler";
import { logger } from "./config/logger";
import { corsMiddleware } from "./config/cors";
import { Router } from "express";
import path from "path";
const router = Router();

import eventRoutes from "./modules/event/event.route";
import assetRoutes from "./modules/asset/asset.routes";
import authRoutes from "./modules/authenticate/auth.route";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(corsMiddleware);
app.use(logger);
app.use(express.static(path.join(__dirname, "../public")));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

router.use("/event", eventRoutes);
router.use("/asset", assetRoutes);
router.use("/auth", authRoutes);

app.use(errorHandler);

export { app, router };