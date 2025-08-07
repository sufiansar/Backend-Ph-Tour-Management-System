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
exports.divisionController = void 0;
const sendResponce_1 = require("../../utility/sendResponce");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../utility/catchAsync");
const division_service_1 = require("./division.service");
const createDivision = (0, catchAsync_1.catchAsycn)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const payload = Object.assign(Object.assign({}, req.body), { thumbnail: (_a = req.file) === null || _a === void 0 ? void 0 : _a.path });
    const division = yield division_service_1.divisionService.createDivision(payload);
    (0, sendResponce_1.sendResponse)(res, {
        success: true,
        successCode: http_status_codes_1.default.CREATED,
        message: "Division Create Successfully",
        data: division,
    });
}));
const getAllDivisions = (0, catchAsync_1.catchAsycn)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield division_service_1.divisionService.getAllDivisions();
    (0, sendResponce_1.sendResponse)(res, {
        successCode: 200,
        success: true,
        message: "Divisions retrieved",
        data: result.data,
        meta: result.meta,
    });
}));
const getSingleDivision = (0, catchAsync_1.catchAsycn)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const slug = req.params.slug;
    const result = yield division_service_1.divisionService.getSingleDivision(slug);
    (0, sendResponce_1.sendResponse)(res, {
        successCode: 200,
        success: true,
        message: "Divisions retrieved",
        data: result.data,
    });
}));
const updateDivision = (0, catchAsync_1.catchAsycn)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const payload = Object.assign(Object.assign({}, req.body), { thumbnail: (_a = req.file) === null || _a === void 0 ? void 0 : _a.path });
    const id = req.params.id;
    const result = yield division_service_1.divisionService.updateDivision(id, payload);
    (0, sendResponce_1.sendResponse)(res, {
        successCode: 200,
        success: true,
        message: "Division updated",
        data: result,
    });
}));
const deleteDivision = (0, catchAsync_1.catchAsycn)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield division_service_1.divisionService.deleteDivision(req.params.id);
    (0, sendResponce_1.sendResponse)(res, {
        successCode: 200,
        success: true,
        message: "Division deleted",
        data: result,
    });
}));
exports.divisionController = {
    createDivision,
    updateDivision,
    getAllDivisions,
    getSingleDivision,
    deleteDivision,
};
