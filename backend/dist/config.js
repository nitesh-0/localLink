"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_SECRET = void 0;
exports.JWT_SECRET = process.env.JWT_SECRET;
if (!exports.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
}
//# sourceMappingURL=config.js.map