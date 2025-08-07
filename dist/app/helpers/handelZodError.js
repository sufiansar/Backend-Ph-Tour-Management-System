"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handelZodError = void 0;
const handelZodError = (err) => {
    const errorSource = [];
    err.issues.forEach((issue) => {
        errorSource.push({
            path: issue.path[issue.path.length - 1],
            message: issue.message,
        });
    });
    return {
        StatusCodes: 400,
        message: "Zod Validation Error",
        errorSource,
    };
};
exports.handelZodError = handelZodError;
