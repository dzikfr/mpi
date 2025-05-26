import { z } from "zod";

export const eventBodySchema = z.object({
  name : z.string().min(1, "Name is required"),
  description : z.string().min(1, "Description is required"),
  notes : z.string().optional(),
  date_start : z.coerce.date(),
  date_end : z.coerce.date(),
  url_photo : z.string().optional(),
});
export type EventBodyInput = z.infer<typeof eventBodySchema>;

export const eventParamsSchema = z.object({
  id: z.string().transform(Number),
});
export type EventParamsInput = z.infer<typeof eventParamsSchema>;
