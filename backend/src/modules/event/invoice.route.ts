import { Router } from "express";
import { InvoiceController } from "./invoice.controller";

const router = Router();

router.post("/", InvoiceController.createInvoice);
router.get("/", InvoiceController.getInvoice);

export default router;
