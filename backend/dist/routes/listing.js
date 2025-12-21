"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const zod_1 = require("../zod");
const client_1 = require("@prisma/client");
const middleware_1 = require("../middleware");
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("../cloudinary");
const zod_2 = __importDefault(require("zod"));
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
router.post("/create", middleware_1.authMiddleware, upload.array("images"), async (req, res) => {
    const body = {
        ...req.body,
        price: parseFloat(req.body.price)
    };
    const userId = req.userId || "";
    const isCorrectInput = zod_1.productCreateZod.safeParse(body);
    if (!isCorrectInput.success) {
        res.json({
            msg: "Incorrect imput type"
        });
        return;
    }
    try {
        const files = req.files;
        const uploadPromises = files.map(file => (0, cloudinary_1.uploadBufferToCloudinary)(file.buffer, "localLink.AI"));
        const imageUrls = await Promise.all(uploadPromises);
        const newListing = await prisma.product.create({
            data: {
                name: body.name,
                price: parseFloat(body.price),
                caption: body.caption,
                imageUrl: imageUrls,
                userId: parseInt(userId)
            }
        });
        res.json({
            newListing
        });
    }
    catch (e) {
        res.json({
            msg: "Unexpected error occurred",
            error: e
        });
    }
});
router.get("/all", middleware_1.authMiddleware, async (req, res) => {
    const allProducts = await prisma.product.findMany({
        include: {
            user: {
                select: {
                    id: true
                }
            }
        }
    });
    res.json({
        allProducts
    });
});
router.get("/mylistings", middleware_1.authMiddleware, async (req, res) => {
    const userId = req.userId || "";
    try {
        const mylistings = await prisma.product.findMany({
            where: {
                userId: parseInt(userId)
            }
        });
        res.json({
            mylistings
        });
    }
    catch (e) {
        res.json({
            msg: "Unexpected error occurred",
            e
        });
    }
});
router.get("/me", middleware_1.authMiddleware, async (req, res) => {
    console.log("me route hit");
    const productId = req.query.productId;
    if (!productId) {
        return res.status(400).json({ msg: "Missing productId in query" });
    }
    try {
        const me = await prisma.product.findFirst({
            where: {
                id: parseInt(productId)
            }
        });
        res.json({
            me
        });
    }
    catch (e) {
        res.json({
            msg: "Unexpected error occurred",
            e
        });
    }
});
router.get("/bulk", middleware_1.authMiddleware, async (req, res) => {
    console.log("backend route hit");
    const location = req.query.location;
    const category = req.query.category;
    console.log("location: ", location);
    console.log("category: ", category);
    try {
        const filteredProducts = await prisma.product.findMany({
            where: {
                user: {
                    role: "BUSINESS",
                    ...(location && { location: { contains: location, mode: "insensitive" } }),
                    ...(category && { category: { contains: category, mode: "insensitive" } }),
                },
            },
            include: {
                user: {
                    select: {
                        businessName: true,
                        location: true,
                        category: true,
                    },
                },
            },
        });
        console.log("found products:", filteredProducts.length);
        res.json({
            filteredProducts
        });
    }
    catch (e) {
        res.json({
            msg: "Unexpeced error occurred",
            e
        });
    }
});
router.put("/update/:id", middleware_1.authMiddleware, upload.array("images"), async (req, res) => {
    console.log("update route hit");
    const body = {
        ...req.body,
        price: parseFloat(req.body.price)
    };
    const isCorrectInput = zod_1.productUpdateZod.safeParse(body);
    if (!isCorrectInput.success) {
        res.json({
            msg: "Incorrect input type"
        });
        return;
    }
    const productId = req.params.id || "";
    try {
        const files = req.files;
        // Parse existingImages safely (stringified JSON)
        const existingImages = body.existingImages ? JSON.parse(body.existingImages) : [];
        // Upload new images if provided
        const newImageUrls = files.length
            ? await Promise.all(files.map(file => (0, cloudinary_1.uploadBufferToCloudinary)(file.buffer, "localLink.AI")))
            : [];
        // Merge both
        const allImages = [...existingImages, ...newImageUrls];
        const updatedListing = await prisma.product.update({
            where: {
                id: parseInt(productId)
            },
            data: {
                name: body.name,
                caption: body.caption,
                imageUrl: allImages,
                price: body.price
            }
        });
        res.json({
            updatedListing
        });
    }
    catch (e) {
        res.json({
            msg: "unexpected error occurred"
        });
    }
});
router.put("/update/basic/:id", middleware_1.authMiddleware, async (req, res) => {
    console.log("update route hit");
    const body = {
        ...req.body,
    };
    const updateZod = zod_2.default.object({
        available: zod_2.default.boolean(),
    });
    const isCorrectInput = updateZod.safeParse(body);
    if (!isCorrectInput.success) {
        res.json({
            msg: "Incorrect input type"
        });
        return;
    }
    const productId = req.params.id || "";
    try {
        const updatedListing = await prisma.product.update({
            where: {
                id: parseInt(productId)
            },
            data: {
                available: req.body.available
            }
        });
        res.json({
            updatedListing
        });
    }
    catch (e) {
        res.json({
            msg: "unexpected error occurred"
        });
    }
});
router.delete("/delete/:id", middleware_1.authMiddleware, async (req, res) => {
    const productId = req.params.id || "";
    try {
        const deletedProduct = await prisma.product.delete({
            where: {
                id: parseInt(productId)
            }
        });
        res.json({
            msg: "Product deleted successfully",
            deletedProduct
        });
    }
    catch (e) {
        res.json({
            msg: "unexpected error occurred",
            e
        });
    }
});
exports.default = router;
//# sourceMappingURL=listing.js.map