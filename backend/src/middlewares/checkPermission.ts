import { Request, Response, NextFunction } from "express";
import { Role } from "../types/shared/role";
import path from "path";

const checkPermission = (...allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const userRole = req.user?.role;

    if (!userRole) {
      res.status(401).json({
        success: false,
        message: "Unauthorized: No role found in user session",
      });
      return;
    }

    if (userRole === "admin") {
      next();
      return;
    }

    if (allowedRoles.includes(userRole as Role)) {
      next();
      return;
    }

    res.status(403).sendFile(path.join(__dirname, "../../public/forbidden.html"));
  };
};

export { checkPermission };
