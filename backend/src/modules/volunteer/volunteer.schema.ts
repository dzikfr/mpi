import { z } from "zod";

export const volunteerBodySchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  nik: z.string().min(1, "NIK is required"),
  full_name: z.string().min(1, "Full name is required"),
  address: z.string().nullable().optional(),
  age: z.coerce.number().nullable().optional(),
  email: z.string().email("Invalid email").min(1, "Email is required"),
  phone: z.string().nullable().optional(),
});
export type VolunteerBodyInput = z.infer<typeof volunteerBodySchema>;

export const volunteerParamsSchema = z.object({
  id: z.string().transform(Number),
});
export type VolunteerParamsInput = z.infer<typeof volunteerParamsSchema>;