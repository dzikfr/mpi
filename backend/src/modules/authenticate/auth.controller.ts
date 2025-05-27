import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";
import { loginSchema, registerSchema } from "./auth.schema";
import { apiResponse } from "../../shared/apiResponse";

const authService = new AuthService();

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = loginSchema.parse(req.body);
      const result = await authService.loginUser(validated);
      res.status(200).json(apiResponse(true, "Login successful", result));
    } catch (err: any) {
      next(err);
    }
  }

  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = registerSchema.parse(req.body);
      const result = await authService.registerUser(validated);
      res
        .status(200)
        .json(apiResponse(true, "Registration successful", result));
    } catch (err: any) {
      next(err);
    }
  }

  static async changePassword(req: Request, res: Response, next: NextFunction) : Promise<any> {
    try {
      const { userId } = req.params;
      const { oldPassword, newPassword } = req.body;

      if (!userId || !oldPassword || !newPassword) {
        return res
          .status(400)
          .json(apiResponse(false, "Missing required fields"));
      }

      const result = await authService.changePassword(
        userId,
        oldPassword,
        newPassword
      );
      res.status(200).json(apiResponse(true, "Password changed successfully", result));
    } catch (err: any) {
      next(err);
    }
  }
}
