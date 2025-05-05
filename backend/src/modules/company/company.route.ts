import { Router } from "express";
import { CompanyController } from "./company.controller";

const router = Router();

router.post("/", CompanyController.createCompany);
router.get("/", CompanyController.getCompanies);
router.put("/:id_company", CompanyController.updateCompany);
router.delete("/:id_company", CompanyController.deleteCompany);

export default router;
