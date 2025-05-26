import { Request, Response, NextFunction } from "express";
import { dynamicService } from "./dynamic.service";
import { dynamicBodySchema, dynamicParamsSchema } from "./dynamic.schema";
import { apiResponse } from "../../shared/apiResponse";
import { validInputGet } from "./dynamic.schema";
import type { ValidType } from "./dynamic.schema"

const service = new dynamicService();

export class DynamicController {
	static async createListData(req: Request, res: Response, next: NextFunction) : Promise<void | Response> {
		try {
            const { type } = req.params;

            if (!validInputGet.includes(type as ValidType)) {
                return res.status(400).json(apiResponse(false, "Invalid type"));
            }

			const validated = dynamicBodySchema.parse(req.body);
            const safeType = type as ValidType;

			const result = await service.createListData(validated, safeType);
			res.status(201).json(apiResponse(true, "List data created", result));
		} catch (err) {
			next(err);
		}
	}

	static async getListData(req: Request, res: Response, next: NextFunction) : Promise<void | Response> {
		try {
			const { type } = req.params;

            if (!validInputGet.includes(type as ValidType)) {
                return res.status(400).json(apiResponse(false, "Invalid type"));
            }

		    const safeType = type as ValidType;
			const result = await service.getListData({ skip: 0, take: 50 }, safeType);
			res.status(200).json(apiResponse(true, "Invoice fetched", result));
		} catch (err) {
			next(err);
		}
	}
}
