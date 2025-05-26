import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username is required")
    .regex(/^[A-Za-z0-9]+$/, "Username must contain only letters and numbers"),
  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
      "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character"
    ),
  role_id: z.string().uuid("Invalid role ID")
});

export type RegisterInput = z.infer<typeof registerSchema>;