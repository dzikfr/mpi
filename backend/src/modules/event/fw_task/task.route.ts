import { Router } from "express";
import { TaskController } from "./task.controller";
import { authenticateToken } from "../../../middlewares/authenticate";
import { checkPermission }  from "../../../middlewares/checkPermission";

const router = Router();

router.post("/", authenticateToken, checkPermission("admin") , TaskController.createTask);
router.get("/", authenticateToken , TaskController.getTasks);
router.put("/:id", authenticateToken, checkPermission("admin") , TaskController.updateTask);
router.delete("/:id", authenticateToken, checkPermission("admin") , TaskController.deleteTask);

export default router;
