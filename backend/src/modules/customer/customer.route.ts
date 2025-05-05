import { Router } from "express";
import { CustomerController } from "./customer.controller";

const router = Router();

router.post("/", CustomerController.createCustomer);
router.get("/", CustomerController.getCustomers);
router.put("/:id_customer", CustomerController.updateCustomer);
router.delete("/:id_customer", CustomerController.deleteCustomer);

export default router;
