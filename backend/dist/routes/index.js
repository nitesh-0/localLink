"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("./user"));
const listing_1 = __importDefault(require("./listing"));
const chatController_1 = __importDefault(require("../controllers/chatController"));
const router = express_1.default.Router();
router.use("/user", user_1.default);
router.use("/listing", listing_1.default);
router.use("/chat", chatController_1.default);
router.get("/inside", (req, res) => {
    res.json({
        msg: "HI from the inside router"
    });
});
exports.default = router;
//# sourceMappingURL=index.js.map