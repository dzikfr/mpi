import { z } from "zod";

export const assetBodySchema = z.object({
  name : z.string().min(1, "Name is required"),
  type: z.string().optional(),
  description : z.string().optional(),
  quantity : z.coerce.number().optional(),
  available_quantity : z.coerce.number().optional(),
  notes : z.string().optional(),
});
export type AssetBodyInput = z.infer<typeof assetBodySchema>;

export const assetParamsSchema = z.object({
  id: z.string().min(1, "ID is required"),
});
export type AssetParamsInput = z.infer<typeof assetParamsSchema>;
