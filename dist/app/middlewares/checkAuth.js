"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = void 0;
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const jwt_1 = require("../utility/jwt");
const env_1 = require("../config/env");
const user_interface_1 = require("../modules/user/user.interface");
const user_model_1 = require("../modules/user/user.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
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
const checkAuth = (...authRoles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const accecToken = req.headers.authorization;
            if (!accecToken) {
                throw new AppError_1.default(403, "Token Not found", "");
            }
            const verifiedToken = (0, jwt_1.verifyToken)(accecToken, env_1.envVars.JWT_ACCESS_SECRET);
            const isUserexit = yield user_model_1.User.findOne({ email: verifiedToken.email });
            if (!isUserexit) {
                throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User does not exist", "");
            }
            if (isUserexit.isactive === user_interface_1.Isactive.BLOCKED ||
                isUserexit.isactive === user_interface_1.Isactive.INACTIVE) {
                throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `User is ${isUserexit.isactive}`, "");
            }
            if (isUserexit.isdeleted) {
                throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User deleted", "");
            }
            if (!isUserexit.isVerified) {
                throw new AppError_1.default(403, "User Not Verified", "");
            }
            if (!authRoles.includes(verifiedToken.role)) {
                throw new AppError_1.default(403, "You are not permitted to access this route", "");
            }
            req.user = verifiedToken;
            next();
        }
        catch (error) {
            next(error);
        }
    });
};
exports.checkAuth = checkAuth;
