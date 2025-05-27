import { Request, Response, NextFunction } from "express";
import { EventVolunteerService } from "./event-volunteer.service";
import { taskBulkSchema } from "./event-volunteer.schema";
import { eventVolunteerBodySchema, eventVolunteerParamsSchema, eventVolunteerUpdateBodySchema } from "./event-volunteer.schema";
import { apiResponse } from "../../../shared/apiResponse";

const service = new EventVolunteerService();

export class EventVolunteerController {
  static async createEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const rawData = Array.isArray(req.body) ? req.body : [req.body];
      const validatedData = taskBulkSchema.parse(rawData);
      const result = await service.createEventVolunteer(validatedData);
      res.status(201).json(apiResponse(true, "Event Volunteer created", result));
    } catch (err) {
      next(err);
    }
  }

  static async getEventVolunteers(req: Request, res: Response, next: NextFunction) {
    try {
      const get = {
        skip : parseInt(req.query.take as string) || 0,
        take : parseInt(req.query.skip as string) || 50
      }
      const ref_event_id = req.params.ref_event_id;
      const result = await service.getEventsVolunteer(ref_event_id, get);
      res.status(200).json(apiResponse(true, "Events Volunteer fetched", result));
    } catch (err) {
      next(err);
    }
  }

  static async updateEventVolunteer(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedParams = eventVolunteerParamsSchema.parse(req.params);
      const validatedData = eventVolunteerUpdateBodySchema.parse(req.body);
      const result = await service.updateEventVolunteer(validatedParams.id, validatedData);
      res.status(200).json(apiResponse(true, "Event Volunteer updated", result));
    } catch (err) {
      next(err);
    }
  }

  static async deleteEventVolunteer(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedParams = eventVolunteerParamsSchema.parse(req.params);
      await service.deleteEventVolunteer(validatedParams.id);
      res.status(200).json(apiResponse(true, "Event Volunteer deleted"));
    } catch (err) {
      next(err);
    }
  }
}
