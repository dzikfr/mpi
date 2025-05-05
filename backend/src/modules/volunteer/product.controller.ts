import { Request, Response, NextFunction } from "express";
import { ProductService } from "./product.service";
import { productBodySchema, productParamsSchema } from "./product.schema";
import { apiResponse } from "../../shared/apiResponse";

const productService = new ProductService();

export class ProductController {
  static async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = productBodySchema.parse(req.body);
      const product = await productService.createProduct(validated);
      res.status(201).json(apiResponse(true, "Product created", product));
    } catch (err) {
      next(err);
    }
  }

  static async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await productService.getProducts();
      res.status(200).json(apiResponse(true, "Products fetched", products));
    } catch (err) {
      next(err);
    }
  }

  static async updateProducts(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const validatedParams = productParamsSchema.parse(req.params);
      const validatedBody = productBodySchema.parse(req.body);
      const product = await productService.updateProduct(validatedParams, validatedBody);
      res.status(200).json(apiResponse(true, "Product updated", product));
    } catch (err) {
      next(err);
    }
  }

  static async deleteProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const validatedParams = productParamsSchema.parse(req.params);
      await productService.deleteProduct(validatedParams);
      res.status(200).json(apiResponse(true, "product deleted"));
    } catch (err) {
      next(err);
    }
  }
}
