import { z } from "zod";
import { allowedStatusParams } from "../../../types/shared/status";

const statusValues = allowedStatusParams.map((item) => item.value) as [string, ...string[]];

export const taskBodySchema = z.object({
  ref_event_id: z.string().min(1, "Event ID is required"),
  ref_assigner_id: z.string().nullable().optional(),
  ref_updater_id: z.string().nullable().optional(),
  name: z.string().min(1, "Task name is required"),
  due_at: z.coerce.date().nullable().optional(),
  completed_at: z.coerce.date().nullable().optional(),
  notes: z.string().nullable().optional(),
  status: z.enum(statusValues, {
    required_error: "Status is required",
    invalid_type_error: "Status must be one of the allowed values",
  }),
});
export const taskBulkSchema = z.array(taskBodySchema);
export type TaskBodyInput = z.infer<typeof taskBodySchema>;

export const taskParamsSchema = z.object({
  id: z.string().min(1, "Task ID is required"),
});
export type TaskParamsInput = z.infer<typeof taskParamsSchema>;


export const taskUpdateBodySchema = z.object({
  ref_updater_id: z.string().min(1, "Updater ID is required"),
  name: z.string().min(1, "Task name is required"),
  due_at: z.date().nullable().optional(),
  completed_at: z.date().nullable().optional(),
  notes: z.string().nullable().optional(),
  status: z.enum(statusValues, {
    required_error: "Status is required",
    invalid_type_error: "Status must be one of the allowed values",
  }),
});
export type TaskUpdateBodyInput = z.infer<typeof taskUpdateBodySchema>;