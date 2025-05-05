import { z } from "zod";

export const productBodySchema = z.object({
  product_name: z.string().min(1),
  price: z.number().min(0),
  type: z.string().min(1),
  stock: z.number().min(0),
});
export type ProductBodyInput = z.infer<typeof productBodySchema>;

export const productParamsSchema = z.object({
  id_product: z.string().transform(Number),
});
export type ProductParamsInput = z.infer<typeof productParamsSchema>;
