import { Request, Response, NextFunction } from "express";
import { eventService } from "./event.service";
import { eventBodySchema, eventParamsSchema } from "./event.schema";
import { apiResponse } from "../../shared/apiResponse";

const service = new eventService();

export class EventController {
  static async createEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = eventBodySchema.parse(req.body);
      const result = await service.createEvent(validatedData);
      res.status(201).json(apiResponse(true, "Event created", result));
    } catch (err) {
      next(err);
    }
  }

  static async getEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const get = {
        skip : Number(req.params.skip),
        take : Number(req.params.take)
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
      const validatedData = eventBodySchema.parse(req.body);
      const result = await service.updateEvent(validatedParams.id, validatedData);
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
