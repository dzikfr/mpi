import { z } from "zod";

export const customerBodySchema = z.object({
  customer_name: z.string().min(1),
  company_name: z.string().min(1),
  address: z.string().min(1),
});
export type CustomerBodyInput = z.infer<typeof customerBodySchema>;

export const customerParamsSchema = z.object({
  id_customer: z.string().transform(Number),
});
export type CustomerParamsInput = z.infer<typeof customerParamsSchema>;
