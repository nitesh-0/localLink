"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log("reached middleware");
    if (!authHeader || !authHeader.startsWith("Bearer")) {
        res.status(401).json({
            msg: "auth header missing"
        });
        return;
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        res.status(401).json({
            msg: "token missing"
        });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET);
        req.userId = decoded.userId; // ✅ Now TypeScript knows this exists
        req.role = decoded.userRole;
        next();
    }
    catch (e) {
        res.status(403).json({
            msg: "middleware failure",
            error: e,
        });
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=middleware.js.map