import { Router } from "express";
import { AssetController } from "./asset.controller";
import upload from "../../config/multer";
import { authenticateToken } from "../../middlewares/authenticate";
import { checkPermission }  from "../../middlewares/checkPermission";

const router = Router();

router.post("/", authenticateToken, checkPermission("admin"), upload.single("photo_url"), AssetController.createAsset);
router.get("/", authenticateToken, AssetController.getAssets);
router.put("/:id", authenticateToken, checkPermission("admin"), upload.single("photo_url"), AssetController.updateAsset);
router.delete("/:id", authenticateToken, checkPermission("admin"), AssetController.deleteAsset);

export default router;
