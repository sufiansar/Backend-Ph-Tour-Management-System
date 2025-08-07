"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MulterUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_1 = require("./cloudinary");
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.cloudinaryUpload,
    params: {
        public_id: (req, file) => {
            const fileName = file.originalname
                .toLowerCase()
                .replace(/\s+/g, "-") //Empty space replace dash,
                .replace(/\./g, "-")
                .replace(/[^a-zA-Z0-9]/g, ""); // non alpa neumeric regx
            const extension = file.originalname.split(".").pop();
            const uniqueName = Math.random().toString(36).substring(2) +
                "-" +
                Date.now() +
                "-" +
                fileName +
                "." +
                extension;
            return uniqueName;
        },
    },
});
exports.MulterUpload = (0, multer_1.default)({ storage: storage });
