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
exports.UserServices = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const user_interface_1 = require("./user.interface");
const user_model_1 = require("./user.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const env_1 = require("../../config/env");
const queryBuilder_1 = require("../../utility/queryBuilder");
const user_constant_1 = require("./user.constant");
const cloudinary_1 = require("../../config/cloudinary");
const mongoose_1 = __importDefault(require("mongoose"));
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload, rest = __rest(payload, ["email", "password"]);
    const isEmailExit = yield user_model_1.User.findOne({ email });
    if (isEmailExit) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User Already Exit", "");
    }
    const hashPassword = yield bcryptjs_1.default.hash(password, Number(env_1.envVars.BCRYPT_SALT_ROUNT));
    const authProvider = {
        provider: "credientials",
        providerId: email,
    };
    const user = yield user_model_1.User.create(Object.assign({ email, password: hashPassword, Auth: [authProvider] }, rest));
    return {
        user,
    };
});
const updateUser = (userId, payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExit = yield user_model_1.User.findById(userId);
    if (!isUserExit) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User Not Found", "");
    }
    if (decodedToken.role === user_interface_1.Role.USER || decodedToken.role === user_interface_1.Role.GUIDE) {
        if (userId !== decodedToken.userId) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are unauthorized to update another user's profile", "");
        }
    }
    if (payload.Role) {
        if (decodedToken.role === user_interface_1.Role.USER || decodedToken.role === user_interface_1.Role.GUIDE) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are Not Athorized", "");
        }
        if (payload.Role === user_interface_1.Role.SUPER_ADMIN || decodedToken.role === user_interface_1.Role.ADMIN) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are Not Athorized", "");
        }
    }
    if (decodedToken.role === user_interface_1.Role.ADMIN &&
        isUserExit.Role === user_interface_1.Role.SUPER_ADMIN) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized to update a superadmin profile", "");
    }
    if (payload.isactive || payload.isdeleted || payload.isVerified) {
        if (decodedToken.role === user_interface_1.Role.USER || decodedToken.role === user_interface_1.Role.GUIDE) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are Not Athorized", "");
        }
    }
    if (payload.password) {
        payload.password = yield bcryptjs_1.default.hash(payload.password, env_1.envVars.BCRYPT_SALT_ROUNT);
    }
    const newUpdateUser = yield user_model_1.User.findByIdAndUpdate(userId, payload, {
        new: true,
        runValidators: true,
    });
    if (payload.picture && (isUserExit === null || isUserExit === void 0 ? void 0 : isUserExit.picture)) {
        yield (0, cloudinary_1.deleteImageFromCLoudinary)(isUserExit.picture);
    }
    return newUpdateUser;
});
const getAllUser = (query) => __awaiter(void 0, void 0, void 0, function* () {
    // const user = await User.find({});
    // const totalUser = await User.countDocuments();
    const userQueryBuilder = new queryBuilder_1.QueryBuilder(user_model_1.User.find(), query);
    const users = yield userQueryBuilder
        .filter()
        .search(user_constant_1.userSearchableFields)
        .fields()
        .sort()
        .paginate();
    const [data, meta] = yield Promise.all([users.build(), users.getMeta()]);
    return {
        data,
        meta,
    };
});
const getSingleUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id).select("-password");
    return {
        data: user,
    };
});
const getMe = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid user ID format");
    }
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new Error("User not Found");
    }
    console.log(userId);
    console.log(user);
    return {
        user,
    };
});
exports.UserServices = {
    createUser,
    getAllUser,
    updateUser,
    getSingleUser,
    getMe,
};
