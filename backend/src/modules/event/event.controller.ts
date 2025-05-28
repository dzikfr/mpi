import { Request, Response, NextFunction } from "express";
import { eventService } from "./event.service";
import { eventBodySchema, eventParamsSchema } from "./event.schema";
import { apiResponse } from "../../shared/apiResponse";

const service = new eventService();

export class EventController {
  static async createEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = eventBodySchema.parse(req.body);
      const photo = req.file ? req.file : null;
      let photo_url = null;
      if (photo) {
        photo_url = `${photo?.destination}${photo?.filename}`;
      }
      const result = await service.createEvent(validatedData, photo_url);
      res.status(201).json(apiResponse(true, "Event created", result));
    } catch (err) {
      next(err);
    }
  }

  static async getEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const get = {
        skip : parseInt(req.query.take as string) || 0,
        take : parseInt(req.query.skip as string) || 50
      }
      const result = await service.getEvents(get);
      res.status(200).json(apiResponse(true, "Events fetched", result));
    } catch (err) {
      next(err);
    }
  }

  static async updateEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedParams = eventParamsSchema.parse(req.params);
      const photo = req.file ? req.file : null;
      let photo_url = null;
      if (photo) {
        photo_url = `${photo?.destination}${photo?.filename}`;
      }
      const validatedData = eventBodySchema.parse(req.body);
      const result = await service.updateEvent(validatedParams.id, validatedData, photo_url);
      res.status(200).json(apiResponse(true, "Event updated", result));
    } catch (err) {
      next(err);
    }
  }

  static async deleteEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedParams = eventParamsSchema.parse(req.params);
      await service.deleteEvent(validatedParams.id);
      res.status(200).json(apiResponse(true, "Event deleted"));
    } catch (err) {
      next(err);
    }
  }
}
