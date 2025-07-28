import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import { verifyToken } from "../utility/jwt";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";
import { Isactive, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import httpSuccessCode from "http-status-codes";

// export const checkAuth =
//   async (...authRoles: string[]) =>
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const accecToken = req.headers.authorization;
//       if (!accecToken) {
//         throw new AppError(403, "Token Not found", "");
//       }

//       const verifiedToken = verifyToken(
//         accecToken,
//         envVars.JWT_ACCESS_SECRET
//       ) as JwtPayload;

//       const isUserexit = await User.findOne({ email: verifiedToken.email });
//       if (!isUserexit) {
//         throw new AppError(
//           httpSuccessCode.BAD_REQUEST,
//           "User Dose not Exit",
//           ""
//         );
//       }

//       if (
//         isUserexit.isactive === Isactive.BLOCKED ||
//         isUserexit.isactive === Isactive.INACTIVE
//       ) {
//         throw new AppError(
//           httpSuccessCode.BAD_REQUEST,
//           `User is ${Isactive}`,
//           ""
//         );
//       }
//       if (isUserexit.isdeleted) {
//         throw new AppError(httpSuccessCode.BAD_REQUEST, "User deleted", "");
//       }

//       if (!authRoles.includes(verifiedToken.role)) {
//         throw new AppError(
//           403,
//           "You are not permitted to access this route",
//           ""
//         );
//       }
//       req.user = verifiedToken;
//       next();
//     } catch (error) {
//       next(error);
//     }
//   };

export const checkAuth = (...authRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accecToken = req.headers.authorization;
      if (!accecToken) {
        throw new AppError(403, "Token Not found", "");
      }

      const verifiedToken = verifyToken(
        accecToken,
        envVars.JWT_ACCESS_SECRET
      ) as JwtPayload;

      const isUserexit = await User.findOne({ email: verifiedToken.email });
      if (!isUserexit) {
        throw new AppError(
          httpSuccessCode.BAD_REQUEST,
          "User does not exist",
          ""
        );
      }

      if (
        isUserexit.isactive === Isactive.BLOCKED ||
        isUserexit.isactive === Isactive.INACTIVE
      ) {
        throw new AppError(
          httpSuccessCode.BAD_REQUEST,
          `User is ${isUserexit.isactive}`,
          ""
        );
      }

      if (isUserexit.isdeleted) {
        throw new AppError(httpSuccessCode.BAD_REQUEST, "User deleted", "");
      }
      if (!isUserexit.isVerified) {
        throw new AppError(403, "User Not Verified", "");
      }
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
};
