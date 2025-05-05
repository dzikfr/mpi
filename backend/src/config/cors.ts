import cors from "cors";
import { RequestHandler } from "express";

const allowedOrigins = [process.env.CLIENT_URL];

export const corsMiddleware: RequestHandler = cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
});
