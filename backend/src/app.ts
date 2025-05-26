import express from "express";
import { errorHandler } from "./middlewares/errorHandler";
import { logger } from "./config/logger";
import { corsMiddleware } from "./config/cors";
import { Router } from "express";
const router = Router();

import eventRoutes from "./modules/event/event.route";
import assetRoutes from "./modules/asset/asset.routes";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(corsMiddleware);
app.use(logger);

router.use("/event", eventRoutes);
router.use("/asset", assetRoutes);

app.use(errorHandler);

export { app, router };