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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const user_interface_1 = require("../user/user.interface");
const user_model_1 = require("../user/user.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../../config/env");
const user_tokens_1 = require("../../utility/user.tokens");
const sendMail_1 = require("../../utility/sendMail");
const credentialsLogin = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload;
    const isUserexit = yield user_model_1.User.findOne({ email });
    if (!isUserexit) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User Dose not Exit", "");
    }
    const ispasswordMatch = yield bcryptjs_1.default.compare(password, isUserexit.password);
    if (!ispasswordMatch) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Incorrect Password", "");
    }
    // const jwtPayload = {
    //   email: isUserexit.email,
    //   userId: isUserexit._id,
    //   role: isUserexit.Role,
    // };
    // const accecToken = generateToken(
    //   jwtPayload,
    //   envVars.JWT_ACCESS_SECRET,
    //   envVars.JWT_EXPIREDATE
    // );
    // const refreshToken = generateToken(
    //   jwtPayload,
    //   envVars.JWT_REFRESH_SECRET,
    //   envVars.JWT_REFRESH_EXPIRES
    // );
    const userToken = (0, user_tokens_1.createUserToken)(isUserexit);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _a = isUserexit.toObject(), { password: pass } = _a, rest = __rest(_a, ["password"]);
    return {
        accessToken: userToken.accessToken,
        refreshToken: userToken.refreshToken,
        user: rest,
    };
});
const getNewAccessToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const newAccesessToken = yield (0, user_tokens_1.createNewaccessTokenWithRefreshToken)(refreshToken);
    // console.log(refreshToken);
    // const verifyRefreshToken = verifyToken(
    //   refreshToken,
    //   envVars.JWT_REFRESH_SECRET
    // ) as JwtPayload;
    // const isUserexit = await User.findOne({ email: verifyRefreshToken.email });
    // if (!isUserexit) {
    //   throw new AppError(httpSuccessCode.BAD_REQUEST, "User Dose not Exit", "");
    // }
    // if (
    //   isUserexit.isactive === Isactive.BLOCKED ||
    //   isUserexit.isactive === Isactive.INACTIVE
    // ) {
    //   throw new AppError(httpSuccessCode.BAD_REQUEST, `User is ${Isactive}`, "");
    // }
    // if (isUserexit.isdeleted) {
    //   throw new AppError(httpSuccessCode.BAD_REQUEST, "User deleted", "");
    // }
    // const jwtPayload = {
    //   email: isUserexit.email,
    //   userId: isUserexit._id,
    //   role: isUserexit.Role,
    // };
    // const accecToken = generateToken(
    //   jwtPayload,
    //   envVars.JWT_ACCESS_SECRET,
    //   envVars.JWT_EXPIREDATE
    // );
    // const resetPassword = async (refreshToken: string) => {
    //   const newAccesessToken = await createNewaccessTokenWithRefreshToken(
    //     refreshToken
    //   );
    return {
        accessToken: newAccesessToken,
    };
});
const setPassword = (userId, PlainPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User Not Found", "");
    }
    if (user.password &&
        user.Auth.some((providerObject) => providerObject.provider === "google")) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "You Have already Set Password so You Can go nOw ", "");
    }
    const hashPassword = yield bcryptjs_1.default.hash(PlainPassword, Number(env_1.envVars.BCRYPT_SALT_ROUNT));
    const credentialProvider = {
        provider: "credientials",
        providerId: user.email,
    };
    const auths = [...user.Auth, credentialProvider];
    user.password = hashPassword;
    user.Auth = auths;
    yield user.save();
});
const resetPassword = (payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (payload.id !== decodedToken.userId) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "You cannot reset your password", "");
    }
    const user = yield user_model_1.User.findById(decodedToken.userId).select("+password");
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found", "");
    }
    if (!payload.newPassword) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "New password is required", "");
    }
    const hashPassword = yield bcryptjs_1.default.hash(payload.newPassword, Number(env_1.envVars.BCRYPT_SALT_ROUNT));
    user.password = hashPassword;
    yield user.save();
});
const forgotPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExit = yield user_model_1.User.findOne({ email });
    if (!isUserExit) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User does not exist", "");
    }
    if (isUserExit.isactive === user_interface_1.Isactive.BLOCKED ||
        isUserExit.isactive === user_interface_1.Isactive.INACTIVE) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `User is ${isUserExit.isactive}`, "");
    }
    if (isUserExit.isdeleted) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User deleted", "");
    }
    if (!isUserExit.isVerified) {
        throw new AppError_1.default(403, "User Not Verified", "");
    }
    const jwtPayload = {
        userId: isUserExit._id,
        email: isUserExit.email,
        role: isUserExit.Role,
    };
    const resetLink = jsonwebtoken_1.default.sign(jwtPayload, env_1.envVars.JWT_ACCESS_SECRET, {
        expiresIn: "10m",
    });
    const resetUILink = `${env_1.envVars.FONTEND_URL}/reset-Password?id=${isUserExit._id}&token=${resetLink}`;
    (0, sendMail_1.sendEmail)({
        to: isUserExit.email,
        subject: "Forget Password",
        templateName: "forgetPassword",
        templateData: {
            name: isUserExit.name,
            resetUILink,
        },
    });
});
const changePassword = (decodedToken, newPassword, oldPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(decodedToken.userId);
    console.log(newPassword);
    const isOldPasswordMatch = yield bcryptjs_1.default.compare(oldPassword, user.password);
    if (!isOldPasswordMatch) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Passaword does not mathch Try Agin", "");
    }
    user.password = yield bcryptjs_1.default.hash(newPassword, Number(env_1.envVars.BCRYPT_SALT_ROUNT));
    user.save();
});
exports.AuthServices = {
    credentialsLogin,
    getNewAccessToken,
    resetPassword,
    changePassword,
    forgotPassword,
    setPassword,
};
