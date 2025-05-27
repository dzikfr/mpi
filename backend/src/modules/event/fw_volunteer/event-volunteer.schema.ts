import { z } from "zod";

export const eventVolunteerBodySchema = z.object({
    ref_event_id: z.string().min(1, "Event ID is required"),
    ref_volunteer_id: z.string().min(1, "Volunteer ID is required"),
    registered_at: z.coerce.date(),
    verified_at: z.coerce.date().optional().nullable(),
    ref_verified_id: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
});
export const taskBulkSchema = z.array(eventVolunteerBodySchema);
export type EventVolunteerBodyInput = z.infer<typeof eventVolunteerBodySchema>;

export const eventVolunteerParamsSchema = z.object({
  id: z.string().min(1, "Event Volunteer ID is required"),
});
export type EventVolunteerParamsInput = z.infer<typeof eventVolunteerParamsSchema>;


export const eventVolunteerUpdateBodySchema = z.object({
    registered_at: z.coerce.date(),
    verified_at: z.coerce.date().optional().nullable(),
    notes: z.string().optional().nullable(),
});
export type EventVolunteerUpdateBodyInput = z.infer<typeof eventVolunteerUpdateBodySchema>;