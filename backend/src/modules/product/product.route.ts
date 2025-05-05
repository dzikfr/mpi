import { Router } from "express";
import { ProductController } from "./product.controller";

const router = Router();

router.post("/", ProductController.createProduct);
router.get("/", ProductController.getProducts);
router.put("/:id_product", ProductController.updateProducts);
router.delete("/:id_product", ProductController.deleteProduct);

export default router;
