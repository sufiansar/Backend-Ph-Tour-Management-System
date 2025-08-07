"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchAsycn = void 0;
const catchAsycn = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
        next(err);
    });
};
exports.catchAsycn = catchAsycn;
