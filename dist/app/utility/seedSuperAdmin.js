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
exports.seedSuparAdmin = void 0;
const env_1 = require("../config/env");
const user_interface_1 = require("../modules/user/user.interface");
const user_model_1 = require("../modules/user/user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const seedSuparAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isSuperAdminExit = yield user_model_1.User.findOne({
            email: env_1.envVars.SUPER_ADMIN_EMAIL,
        });
        if (isSuperAdminExit) {
            console.log("SuperAdmin Already Exit");
            return;
        }
        const authProvider = {
            provider: "credientials",
            providerId: env_1.envVars.SUPER_ADMIN_EMAIL,
        };
        const hashPassword = yield bcryptjs_1.default.hash(env_1.envVars.SUPER_ADMIN_PASSWORD, Number(env_1.envVars.BCRYPT_SALT_ROUNT));
        const payload = {
            name: "super Admin",
            email: env_1.envVars.SUPER_ADMIN_EMAIL,
            password: hashPassword,
            isVerified: true,
            Role: user_interface_1.Role.SUPER_ADMIN,
            Auth: [authProvider],
        };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const superadmin = yield user_model_1.User.create(payload);
    }
    catch (error) {
        console.error("Error seeding Super Admin:", error);
    }
});
exports.seedSuparAdmin = seedSuparAdmin;
