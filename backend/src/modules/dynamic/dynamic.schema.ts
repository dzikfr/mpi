import { z } from "zod";
import { validInputGet } from "./dynamic.type";

export const dynamicBodySchema = z.object({
	value: z.string().min(1 , "Value is required"),
	description: z.string().optional(),
});
export type DynamicBodyInput = z.infer<typeof dynamicBodySchema>;

export const dynamicParamsSchema = z.object({
    id: z.string().transform(Number),
});
export type DynamicParamsInput = z.infer<typeof dynamicParamsSchema>;

export const getSchema = z.object({
    table_name: z.string().min(1, "Table name is required"),
    column_name: z.string().min(1, "Column name is required"),
    skip: z.coerce.number().min(0),
    take: z.coerce.number().min(1),
})

export type GetInput = z.infer<typeof getSchema>;

export type ValidType = typeof validInputGet[number];
