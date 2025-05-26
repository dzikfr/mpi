import { Request, Response, NextFunction } from "express";
import { assetService } from "./asset.service";
import { assetBodySchema, assetParamsSchema } from "./asset.schema";
import { apiResponse } from "../../shared/apiResponse";

const service = new assetService();

export class AssetController {
  static async createAsset(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = assetBodySchema.parse(req.body);
      const result = await service.createAsset(validatedData);
      res.status(201).json(apiResponse(true, "Asset created", result));
    } catch (err) {
      next(err);
    }
  }

  static async getAssets(req: Request, res: Response, next: NextFunction) {
    try {
      const get = {
        skip : Number(req.params.skip),
        take : Number(req.params.take)
      }
      const result = await service.getAssets(get);
      res.status(200).json(apiResponse(true, "Assets fetched", result));
    } catch (err) {
      next(err);
    }
  }

  static async updateAsset(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedParams = assetParamsSchema.parse(req.params);
      const validatedData = assetBodySchema.parse(req.body);
      const result = await service.updateAsset(validatedParams.id, validatedData);
      res.status(200).json(apiResponse(true, "Asset updated", result));
    } catch (err) {
      next(err);
    }
  }

  static async deleteAsset(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedParams = assetParamsSchema.parse(req.params);
      await service.deleteAsset(validatedParams.id);
      res.status(200).json(apiResponse(true, "Asset deleted"));
    } catch (err) {
      next(err);
    }
  }
}
