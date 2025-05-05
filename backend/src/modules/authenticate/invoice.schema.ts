import { z } from "zod";

export const invoiceBodySchema = z.object({
  date: z.coerce.date(),
  payment_method: z.string().min(1),
  ppn: z.number().min(0),
  dp: z.number().min(0),
  user: z.string().min(1),
  id_customer: z.number().min(1),
  id_company: z.number().min(1),
  details: z.array(
    z.object({
      id_product: z.number().min(1),
      qty: z.number().min(1),
      price: z.number().min(0),
    })
  ),
});
export type InvoiceBodyInput = z.infer<typeof invoiceBodySchema>;

export const invoiceParamsSchema = z.object({
  invoice_number: z.string().transform(Number),
});
export type InvoiceParamsInput = z.infer<typeof invoiceParamsSchema>;
