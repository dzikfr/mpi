import { Router } from "express";
import { EventController } from "./event.controller";

const router = Router();

router.post("/", EventController.createEvent);
// router.get("/", InvoiceController.getInvoice);

// export default router;
