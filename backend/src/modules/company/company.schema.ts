import { number, z } from "zod";

export const companyBodySchema = z.object({
  company_name: z.string().min(1),
  address: z.string().min(1),
  number: z.string().min(1),
  fax: z.string().min(1),
});
export type CompanyBodyInput = z.infer<typeof companyBodySchema>;

export const companyParamsSchema = z.object({
  id_company: z.string().transform(Number),
});
export type CompanyParamsInput = z.infer<typeof companyParamsSchema>;
