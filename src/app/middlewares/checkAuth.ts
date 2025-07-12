import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import { verifyToken } from "../utility/jwt";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import { Role } from "../modules/user/user.interface";

export const checkAuth =
  (...authRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const accecToken = req.headers.authorization;
      if (!accecToken) {
        throw new AppError(403, "Token Not found", "");
      }
      const verifiedToken = verifyToken(
        accecToken,
        envVars.JWT_ACCESS_SECRET
      ) as JwtPayload;

      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(
          403,
          "You are not permitted to access this route",
          ""
        );
      }
      req.user = verifiedToken;
      next();
    } catch (error) {
      next(error);
    }
  };
