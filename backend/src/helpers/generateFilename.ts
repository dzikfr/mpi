import { v4 as uuidv4 } from "uuid";
import path from "path";

export const generateFileName = (originalname: string): string => {
  return `${Date.now()}-${uuidv4()}${path.extname(originalname)}`;
};