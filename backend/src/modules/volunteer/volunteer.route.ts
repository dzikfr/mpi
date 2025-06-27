import { Router } from "express";
import { VolunteerController } from "./volunteer.controller";
import upload from "../../config/multer";
import { authenticateToken } from "../../middlewares/authenticate";
import { checkPermission }  from "../../middlewares/checkPermission";

const router = Router();

router.post("/", authenticateToken, checkPermission("admin") , upload.single("url_photo"), VolunteerController.createVolunteer);
router.get("/", authenticateToken , VolunteerController.getVolunteers);
// router.put("/:id_product", ProductController.updateProducts);
// router.delete("/:id_product", ProductController.deleteProduct);

export default router;
