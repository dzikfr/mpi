import { Request, Response, NextFunction } from "express";
import { CustomerService } from "./customer.service";
import { customerBodySchema, customerParamsSchema } from "./customer.schema";
import { apiResponse } from "../../shared/apiResponse";

const service = new CustomerService();

export class CustomerController {
  static async createCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = customerBodySchema.parse(req.body);
      const result = await service.createCustomer(validated);
      res.status(201).json(apiResponse(true, "Customer created", result));
    } catch (err) {
      next(err);
    }
  }

  static async getCustomers(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.getCustomers();
      res.status(200).json(apiResponse(true, "Customers fetched", result));
    } catch (err) {
      next(err);
    }
  }

  static async updateCustomer(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const validatedParams = customerParamsSchema.parse(req.params);
      const validatedBody = customerBodySchema.parse(req.body);
      const result = await service.updateCustomer(validatedParams, validatedBody);
      res.status(200).json(apiResponse(true, "Customer updated", result));
    } catch (err) {
      next(err);
    }
  }

  static async deleteCustomer(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const validatedParams = customerParamsSchema.parse(req.params);
      await service.deleteCustomer(validatedParams);
      res.status(200).json(apiResponse(true, "Customer deleted"));
    } catch (err) {
      next(err);
    }
  }
}
