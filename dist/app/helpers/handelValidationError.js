"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handelValidationError = void 0;
const handelValidationError = (err) => {
    const errorSource = [];
    Object.values(err.errors).forEach((e) => {
        errorSource.push({
            path: e.path,
            message: e.message,
        });
    });
    return {
        StatusCodes: 400,
        message: "validation Error",
        errorSource,
    };
};
exports.handelValidationError = handelValidationError;
