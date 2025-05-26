import { Router } from "express";
import { EventController } from "./event.controller";
import upload from "../../config/multer";

const router = Router();

router.post("/", upload.single("photo_url"), EventController.createEvent);
router.get("/", EventController.getEvents);
router.put("/:id", upload.single("photo_url"), EventController.updateEvent);
router.delete("/:id", EventController.deleteEvent);

export default router;
