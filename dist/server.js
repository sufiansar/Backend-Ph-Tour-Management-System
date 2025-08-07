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
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const env_1 = require("./app/config/env");
const seedSuperAdmin_1 = require("./app/utility/seedSuperAdmin");
const radis_confiq_1 = require("./app/config/radis.confiq");
let server;
const stateServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(env_1.envVars.DB_URL);
        console.log("connect to DB");
        server = app_1.default.listen(env_1.envVars.PORT, () => {
            console.log(`server is listening ${env_1.envVars.PORT}`);
        });
    }
    catch (error) {
        console.log(error);
    }
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, radis_confiq_1.connectRedis)();
    yield stateServer();
    yield (0, seedSuperAdmin_1.seedSuparAdmin)();
}))();
// process.on("SIGTERM", () => {
//   console.log("SIGTERM Ditected .... server shutting off");
//   if (server) {
//     server.close();
//     process.exit;
//   }
//   process.exit;
// });
// unhandledRejection;
process.on("unhandledRejection", () => {
    console.log(" unhandle Rejecton detected.....Server shutting off ");
    if (server) {
        server.close();
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        process.exit;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    process.exit;
});
// uncaughtException
process.on("uncaughtException", (err) => {
    console.log("Uncaught Exception Detected.....server shutting off", err);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    if (server) {
        server.close();
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        process.exit;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    process.exit;
});
