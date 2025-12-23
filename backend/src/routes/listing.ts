import express from "express"
import { productCreateZod, productUpdateZod } from "../zod"
import { PrismaClient } from "@prisma/client"
import { authMiddleware } from "../middleware"
import multer from "multer"
import { uploadBufferToCloudinary } from "../cloudinary"
import zod from "zod"

const router = express.Router()

const prisma = new PrismaClient()

const storage = multer.memoryStorage()
const upload = multer({storage})

router.post("/create", authMiddleware, upload.array("images") , async (req, res) => {
    const body = {
        ...req.body,
        price: parseFloat(req.body.price)
    }
    const userId = req.userId || ""

    const isCorrectInput = productCreateZod.safeParse(body)

    if(!isCorrectInput.success){
        res.json({
            msg: "Incorrect imput type"
        })
        return
    }

    try{

        const files = req.files as Express.Multer.File[];

        const uploadPromises = files.map(file =>
            uploadBufferToCloudinary(file.buffer, "localLink.AI")
        );

        const imageUrls = await Promise.all(uploadPromises);

        const newListing = await prisma.product.create({
            data: {
                name: body.name,
                price: parseFloat(body.price),
                caption: body.caption,
                imageUrl: imageUrls,
                userId: parseInt(userId)
            }
        })

        res.json({
            newListing
        })
    }

    catch(e){
        res.json({
            msg: "Unexpected error occurred",
            error: e
        })
    }
})

router.get("/all", authMiddleware, async (req, res) => {
    const allProducts = await prisma.product.findMany({
        include:{
            user: {
                select: {
                    id: true
                }
            }
        }
    })

    res.json({
        allProducts
    })
})

router.get("/mylistings", authMiddleware, async (req, res) => {

    const userId = req.userId || ""

    try {
        const mylistings = await prisma.product.findMany({
            where: {
                userId: parseInt(userId)
            }
        })

        res.json({
            mylistings
        })
    } 
    catch(e){
        res.json({
            msg: "Unexpected error occurred",
            e
        })
    }

    
})

router.get("/me", authMiddleware, async (req, res) => {

    console.log("me route hit")

    const productId = req.query.productId as string

    if (!productId) {
        return res.status(400).json({ msg: "Missing productId in query" });
    }

    try {
        const me = await prisma.product.findFirst({
            where: {
                id: parseInt(productId)
            }
        })

        res.json({
            me
        })
    }
    catch(e){
        res.json({
            msg: "Unexpected error occurred",
            e
        })
    }

    
})

router.get("/bulk", authMiddleware, async (req, res) => {
    console.log("backend route hit")

    const location = req.query.location as string | undefined;
    const category = req.query.category as string | undefined;

    console.log("location: ", location)
    console.log("category: ", category)

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
        })
    }
    catch(e){
        res.json({
            msg: "Unexpeced error occurred",
            e
        })
    }

    
})

router.put("/update/:id", authMiddleware, upload.array("images"), async (req, res) => {

    console.log("update route hit")

    const body = {
        ...req.body,
        price: parseFloat(req.body.price)
    }
    

    const isCorrectInput = productUpdateZod.safeParse(body)

    if(!isCorrectInput.success){
        res.json({
            msg: "Incorrect input type"
        })
        return
    }
    
    const productId = req.params.id || ""

    try {

        const files = req.files as Express.Multer.File[];

        // Parse existingImages safely (stringified JSON)
        const existingImages = body.existingImages ? JSON.parse(body.existingImages) : [];

        // Upload new images if provided
        const newImageUrls = files.length
        ? await Promise.all(files.map(file => uploadBufferToCloudinary(file.buffer, "localLink.AI")))
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
        })

        res.json({
            updatedListing
        })
    }

    catch(e){
        res.json({
            msg: "unexpected error occurred"
        })
    }

})

router.put("/update/basic/:id", authMiddleware, async (req, res) => {

    console.log("update route hit")

    const body = {
        ...req.body,
    }

    const updateZod = zod.object({
        available: zod.boolean(),
    });


    const isCorrectInput = updateZod.safeParse(body)

    if(!isCorrectInput.success){
        res.json({
            msg: "Incorrect input type"
        })
        return
    }
    
    const productId = req.params.id || ""

    try {

        const updatedListing = await prisma.product.update({
            where: {
                id: parseInt(productId)
            }, 
            data: {
                available: req.body.available
            }
        })

        res.json({
            updatedListing
        })
    }

    catch(e){
        res.json({
            msg: "unexpected error occurred"
        })
    }

})

router.delete("/delete/:id", authMiddleware, async (req, res) => {
    const productId = req.params.id || ""

    try {
       const deletedProduct = await prisma.product.delete({
            where: {
                id: parseInt(productId)
            }
        })
        
        res.json({
            msg: "Product deleted successfully",
            deletedProduct
        })
    }
    catch(e){
        res.json({
            msg: "unexpected error occurred",
            e
        })
    }
    
})

export default router