"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadBufferToCloudinary = uploadBufferToCloudinary;
// src/lib/cloudinary.ts
const cloudinary_1 = require("cloudinary");
const streamifier_1 = __importDefault(require("streamifier"));
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
function uploadBufferToCloudinary(buffer, folder = "locallink") {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.v2.uploader.upload_stream({ folder, resource_type: "image" }, (error, result) => {
            if (error)
                return reject(error);
            if (!result?.secure_url)
                return reject(new Error("No secure_url from Cloudinary"));
            resolve(result.secure_url);
        });
        streamifier_1.default.createReadStream(buffer).pipe(uploadStream);
    });
}
//# sourceMappingURL=cloudinary.js.map