import { Router } from "express";
import { AssetController } from "./asset.controller";
import upload from "../../config/multer";

const router = Router();

router.post("/", upload.single("photo_url"), AssetController.createAsset);
router.get("/", AssetController.getAssets);
router.put("/:id", upload.single("photo_url"), AssetController.updateAsset);
router.delete("/:id", AssetController.deleteAsset);

export default router;
