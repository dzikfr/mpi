import { z } from "zod";

export const assetBodySchema = z.object({
  name : z.string().min(1, "Name is required"),
  type: z.string().optional(),
  description : z.string().optional(),
  quantity : z.number().optional(),
  available_quantity : z.number().optional(),
  notes : z.string().optional(),
});
export type AssetBodyInput = z.infer<typeof assetBodySchema>;

export const assetParamsSchema = z.object({
  id: z.string().transform(Number),
});
export type AssetParamsInput = z.infer<typeof assetParamsSchema>;
