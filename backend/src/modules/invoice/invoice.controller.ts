import { Request, Response, NextFunction } from "express";
declare module "express-serve-static-core" {
  interface Request {
    client?: any; 
  }
}
import { invoiceService } from "./invoice.service";
import { invoiceBodySchema, invoiceParamsSchema } from "./invoice.schema";
import { apiResponse } from "../../shared/apiResponse";

const service = new invoiceService();

export class InvoiceController {
  static async createInvoice(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = invoiceBodySchema.parse(req.body);
      const result = await service.createInvoice(validated);
      res.status(201).json(apiResponse(true, "Invoice created", result));
    } catch (err) {
      next(err);
    }
  }

  static async getInvoice(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.getInvoice();
      res.status(200).json(apiResponse(true, "Invoice fetched", result));
    } catch (err) {
      next(err);
    }
  }
}
