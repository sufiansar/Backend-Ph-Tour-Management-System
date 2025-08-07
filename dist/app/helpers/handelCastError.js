"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handelCastError = void 0;
const handelCastError = (
// eslint-disable-next-line @typescript-eslint/no-unused-vars
err) => {
    return {
        StatusCodes: 400,
        message: "Invalid MongoDB Object ID. Please send a valid ID.",
    };
};
exports.handelCastError = handelCastError;
