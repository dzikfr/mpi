import { Router } from "express";
import { EventController } from "./event.controller";
import upload from "../../config/multer";
import { authenticateToken } from "../../middlewares/authenticate";
import { checkPermission }  from "../../middlewares/checkPermission";

const router = Router();

router.post("/", authenticateToken, checkPermission("admin") , upload.single("photo_url"), EventController.createEvent);
router.get("/", authenticateToken , EventController.getEvents);
router.put("/:id", authenticateToken, checkPermission("admin") , upload.single("photo_url"), EventController.updateEvent);
router.delete("/:id", authenticateToken, checkPermission("admin") , EventController.deleteEvent);

export default router;
