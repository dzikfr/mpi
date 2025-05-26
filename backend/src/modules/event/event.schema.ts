import { z } from "zod";

export const eventBodySchema = z.object({
  name : z.string().min(1, "Name is required"),
  description : z.string().min(1, "Description is required"),
  notes : z.string().optional(),
  date_start : z.coerce.date(),
  date_end : z.coerce.date(),
});
export type EventBodyInput = z.infer<typeof eventBodySchema>;

export const eventParamsSchema = z.object({
  id: z.string().min(1, "Event ID is required"),
});
export type EventParamsInput = z.infer<typeof eventParamsSchema>;
