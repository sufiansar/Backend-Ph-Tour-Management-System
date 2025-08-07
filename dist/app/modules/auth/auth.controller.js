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
exports.AuthControllers = void 0;
const catchAsync_1 = require("../../utility/catchAsync");
const sendResponce_1 = require("../../utility/sendResponce");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const setAuthCookie_1 = require("../../utility/setAuthCookie");
const auth_service_1 = require("./auth.service");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const user_tokens_1 = require("../../utility/user.tokens");
const env_1 = require("../../config/env");
const passport_1 = __importDefault(require("passport"));
const credentialsLogin = (0, catchAsync_1.catchAsycn)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // const loginInfo = await AuthServices.credentialsLogin(req.body);
    passport_1.default.authenticate("local", { session: false }, (err, user, info) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return next(err);
        }
        if (!user) {
            return next(new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, info.message || "Login Failed", ""));
        }
        const userTokens = (0, user_tokens_1.createUserToken)(user);
        // res.cookie("accessToken", loginInfo.accessToken, {
        //     httpOnly: true,
        //     secure: false
        // })
        // res.cookie("refreshToken", loginInfo.refreshToken, {
        //     httpOnly: true,
        //     secure: false,
        // })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _a = user.toObject(), { password: pass } = _a, rest = __rest(_a, ["password"]);
        (0, setAuthCookie_1.setAuthCookie)(res, userTokens);
        (0, sendResponce_1.sendResponse)(res, {
            success: true,
            successCode: http_status_codes_1.default.OK,
            message: "User Logged In Successfully",
            data: {
                accessToken: userTokens.accessToken,
                refreshToken: userTokens.refreshToken,
                user: rest,
            },
        });
    }))(req, res, next);
}));
const getNewAccessToken = (0, catchAsync_1.catchAsycn)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "No refresh token recieved from cookies", "");
    }
    const tokenInfo = yield auth_service_1.AuthServices.getNewAccessToken(refreshToken);
    // res.cookie("accessToken", tokenInfo.accessToken, {
    //   httpOnly: true,
    //   secure: false,
    // });
    (0, setAuthCookie_1.setAuthCookie)(res, tokenInfo);
    (0, sendResponce_1.sendResponse)(res, {
        success: true,
        successCode: http_status_codes_1.default.OK,
        message: "New Access Token Retrived Successfully",
        data: tokenInfo,
    });
}));
const logOut = (0, catchAsync_1.catchAsycn)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    });
    (0, sendResponce_1.sendResponse)(res, {
        success: true,
        successCode: http_status_codes_1.default.OK,
        message: "User Loged Out Succesfully",
        data: null,
    });
}));
const resetPassword = (0, catchAsync_1.catchAsycn)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    yield auth_service_1.AuthServices.resetPassword(req.body, decodedToken);
    (0, sendResponce_1.sendResponse)(res, {
        success: true,
        successCode: http_status_codes_1.default.OK,
        message: "Password Change  Succesfully",
        data: null,
    });
}));
const setPassword = (0, catchAsync_1.catchAsycn)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const { password } = req.body;
    yield auth_service_1.AuthServices.setPassword(decodedToken.userId, password);
    (0, sendResponce_1.sendResponse)(res, {
        success: true,
        successCode: http_status_codes_1.default.OK,
        message: "Password Change  Succesfully",
        data: null,
    });
}));
const forgotPassword = (0, catchAsync_1.catchAsycn)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    yield auth_service_1.AuthServices.forgotPassword(email);
    (0, sendResponce_1.sendResponse)(res, {
        success: true,
        successCode: http_status_codes_1.default.OK,
        message: "Email Sent Succesfully",
        data: null,
    });
}));
const changePassword = (0, catchAsync_1.catchAsycn)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    console.log(newPassword);
    yield auth_service_1.AuthServices.changePassword(decodedToken, newPassword, oldPassword);
    (0, sendResponce_1.sendResponse)(res, {
        success: true,
        successCode: http_status_codes_1.default.OK,
        message: "Password Change  Succesfully",
        data: null,
    });
}));
const googleCallbackController = (0, catchAsync_1.catchAsycn)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // eslint-disable-next-line prefer-const
    let redirectTo = req.query.state ? req.query.state : "";
    if (redirectTo.startsWith("/")) {
        redirectTo.slice(1);
    }
    const user = req.user;
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User NOt Found", "");
    }
    const tokenInfo = (0, user_tokens_1.createUserToken)(user);
    (0, setAuthCookie_1.setAuthCookie)(res, tokenInfo);
    res.redirect(`${env_1.envVars.FONTEND_URL}/${redirectTo}`);
}));
exports.AuthControllers = {
    credentialsLogin,
    getNewAccessToken,
    logOut,
    resetPassword,
    setPassword,
    changePassword,
    forgotPassword,
    googleCallbackController,
};
