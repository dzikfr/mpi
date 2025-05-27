import jwt from "jsonwebtoken";
import path from "path";
import { Request, Response, NextFunction } from "express";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    res.status(401).json({ message: "Access denied, no token provided" });
    return;
  }

  console.log("Token received:", token);

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as jwt.JwtPayload;

    if (decoded && typeof decoded === "object" && "id" in decoded) {
      req.user = {
        id: decoded.id as string,
        role: decoded.role as string | undefined,
      };
    } else {
      res.status(401).sendFile(path.join(__dirname, "../../public/forbidden.html"));
    }

    console.log("Decoded token:", decoded);

    next();
  } catch (error) {
    console.error("Invalid token:", error);
    res.status(401).json({ message: "Invalid token" });
  }
};
