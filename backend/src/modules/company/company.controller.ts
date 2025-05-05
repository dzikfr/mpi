import { Request, Response, NextFunction } from "express";
import { CompanyService } from "./company.service";
import { companyBodySchema, companyParamsSchema } from "./company.schema";
import { apiResponse } from "../../shared/apiResponse";

const service = new CompanyService();

export class CompanyController {
  static async createCompany(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = companyBodySchema.parse(req.body);
      const result = await service.createCompany(validated);
      res.status(201).json(apiResponse(true, "Company created", result));
    } catch (err) {
      next(err);
    }
  }

  static async getCompanies(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.getCompanies();
      res.status(200).json(apiResponse(true, "Companies fetched", result));
    } catch (err) {
      next(err);
    }
  }

  static async updateCompany(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const validatedParams = companyParamsSchema.parse(req.params);
      const validatedBody = companyBodySchema.parse(req.body);
      const result = await service.updateCompany(validatedParams, validatedBody);
      res.status(200).json(apiResponse(true, "Company updated", result));
    } catch (err) {
      next(err);
    }
  }

  static async deleteCompany(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const validatedParams = companyParamsSchema.parse(req.params);
      await service.deleteCompany(validatedParams);
      res.status(200).json(apiResponse(true, "Company deleted"));
    } catch (err) {
      next(err);
    }
  }
}
