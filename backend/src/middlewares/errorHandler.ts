import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { formatZodError } from "../utils/formatZodError";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: formatZodError(err),
    });
    return;
  }

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};
