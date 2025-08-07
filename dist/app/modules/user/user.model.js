"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const user_interface_1 = require("./user.interface");
const authschema = new mongoose_1.Schema({
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
}, {
    versionKey: false,
    _id: false,
});
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    picture: { type: String },
    address: { type: String },
    phone: { type: String },
    isactive: {
        type: String,
        enum: Object.values(user_interface_1.Isactive),
        default: user_interface_1.Isactive.ACTIVE,
    },
    isdeleted: { type: Boolean, default: false },
    isVerified: { type: String, default: true },
    createdAt: { type: Date, default: Date.now },
    Role: {
        type: String,
        enum: Object.values(user_interface_1.Role),
        default: user_interface_1.Role.USER,
    },
    Auth: [authschema],
}, {
    timestamps: true,
    versionKey: false,
});
exports.User = (0, mongoose_1.model)("User", userSchema);
