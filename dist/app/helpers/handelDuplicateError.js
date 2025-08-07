"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handelDuplicateError = void 0;
const handelDuplicateError = (err) => {
    const matchedArray = err.message.match(/"([^"]*)"/);
    return {
        StatusCodes: 400,
        message: `Duplicate Key Error: ${matchedArray[1]}`,
    };
};
exports.handelDuplicateError = handelDuplicateError;
