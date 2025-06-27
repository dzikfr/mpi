import { Router } from "express";
import { EventVolunteerController } from "./event-volunteer.controller";
import { authenticateToken } from "../../../middlewares/authenticate";
import { checkPermission }  from "../../../middlewares/checkPermission";

const router = Router({ mergeParams: true });

router.post("/", authenticateToken, checkPermission("admin") , EventVolunteerController.createEvent);
router.get("/", authenticateToken , EventVolunteerController.getEventVolunteers);
router.put("/:id", authenticateToken, checkPermission("admin") , EventVolunteerController.updateEventVolunteer);
router.delete("/:id", authenticateToken, checkPermission("admin") , EventVolunteerController.deleteEventVolunteer);

export default router;  