import { Request, Response, NextFunction } from "express";
import { VolunteerService } from "./volunteer.service";
import { volunteerBodySchema, volunteerParamsSchema } from "./volunteer.schema";
import { apiResponse } from "../../shared/apiResponse";

const volunteerService = new VolunteerService();

export class VolunteerController {
  static async createVolunteer(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = volunteerBodySchema.parse(req.body);
      const photo = req.file ? req.file : null;
      let photo_url = null;
      if (photo) {
        photo_url = `${photo?.destination}${photo?.filename}`;
      }
      const product = await volunteerService.createVolunteer(validated, photo_url);
      res.status(201).json(apiResponse(true, "Volunteers created", product));
    } catch (err) {
      next(err);
    }
  }

  static async getVolunteers(req: Request, res: Response, next: NextFunction) {
    try {
      const get = {
        skip : parseInt(req.query.take as string) || 0,
        take : parseInt(req.query.skip as string) || 50
      }
      const result = await volunteerService.getVolunteers(get);
      res.status(200).json(apiResponse(true, "Volunteers fetched", result));
    } catch (err) {
      next(err);
    }
  }

//   static async updateProducts(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> {
//     try {
//       const validatedParams = productParamsSchema.parse(req.params);
//       const validatedBody = productBodySchema.parse(req.body);
//       const product = await productService.updateProduct(validatedParams, validatedBody);
//       res.status(200).json(apiResponse(true, "Product updated", product));
//     } catch (err) {
//       next(err);
//     }
//   }

//   static async deleteProduct(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> {
//     try {
//       const validatedParams = productParamsSchema.parse(req.params);
//       await productService.deleteProduct(validatedParams);
//       res.status(200).json(apiResponse(true, "product deleted"));
//     } catch (err) {
//       next(err);
//     }
//   }
}
