import { Request, Response, NextFunction } from "express";
import { taskService } from "./task.service";
import { taskBodySchema, taskParamsSchema, taskUpdateBodySchema, taskBulkSchema } from "./task.schema";
import { apiResponse } from "../../../shared/apiResponse";

const service = new taskService();

export class TaskController {
  static async createTask(req: Request, res: Response, next: NextFunction) {
    try {
      const rawData = Array.isArray(req.body) ? req.body : [req.body];
      const validatedData = taskBulkSchema.parse(rawData);

      const assignerId = req.user?.id;

      const result = await service.createTasks(validatedData, assignerId);
      res.status(201).json(apiResponse(true, "Task created", result));
    } catch (err) {
      next(err);
    }
  }

  static async getTasks(req: Request, res: Response, next: NextFunction) {
    try {
      const get = {
        skip : Number(req.params.skip),
        take : Number(req.params.take)
      }
      const result = await service.getTasks(get);
      res.status(200).json(apiResponse(true, "Tasks fetched", result));
    } catch (err) {
      next(err);
    }
  }

  static async updateTask(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedParams = taskParamsSchema.parse(req.params);
      const validatedData = taskUpdateBodySchema.parse(req.body);
      const result = await service.updateTask(validatedParams.id, validatedData);
      res.status(200).json(apiResponse(true, "Task updated", result));
    } catch (err) {
      next(err);
    }
  }

  static async deleteTask(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedParams = taskParamsSchema.parse(req.params);
      await service.deleteTask(validatedParams.id);
      res.status(200).json(apiResponse(true, "Task deleted"));
    } catch (err) {
      next(err);
    }
  }
}
