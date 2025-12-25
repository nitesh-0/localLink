import { PrismaClient } from "@prisma/client"
import express from "express"
import { userSigninZod, userSignupZod, userUpdateZod } from "../zod"
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../config"
import { authMiddleware } from "../middleware"
import multer from "multer";
import { uploadBufferToCloudinary } from "../cloudinary";
import crypto from "crypto";
import { sendVerificationEmail } from "../email";



const router = express.Router()

const prisma = new PrismaClient()

// Memory storage keeps file in memory as Buffer
const storage = multer.memoryStorage();
const upload = multer({ storage });

function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

router.post("/create", upload.single("image"), async (req, res) => {
    const body = req.body

    if (body.role === "USER" && !body.name) {
        return res.status(400).json({ msg: "Name is required for USER signup" });
    }

    if (body.role === "BUSINESS" && !body.businessName) {
        return res.status(400).json({ msg: "Business name is required for BUSINESS signup" });
    }

    if (body.role === "BUSINESS" && !body.location) {
        return res.status(400).json({ msg: "Location is required for BUSINESS signup" });
    }

    if (body.role === "BUSINESS" && !body.category) {
        return res.status(400).json({ msg: "Category is required for BUSINESS signup" });
    }


    const isCorrectInput = userSignupZod.safeParse(body)

    if(!isCorrectInput.success){
        res.status(411).json({
            msg: "Incorrect input type"
        })
        return
    }

    try {

        let imageUrl = "";

        // Check if file exists
        if(req.file) {
            // req.file.buffer contains the binary data
            imageUrl = await uploadBufferToCloudinary(req.file.buffer, "localLink.AI");
        }
        

        const newUser = await prisma.user.create({
            data: {
                email: body.email,
                password: body.password,
                location: body.location,
                imageUrl,
                name: body.name,
                businessName: body.businessName,
                role: body.role,
                category: body.category
            }
        })

        const userId = newUser.id
        const userRole = newUser.role

        const token = jwt.sign({
            userId, userRole   
        }, JWT_SECRET)

        // create token
        const email_token = generateToken();
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

        const created_token =  await prisma.emailVerificationToken.create({
            data: {
                userId: newUser.id,
                token: email_token,
                expiresAt,
            },
        });

        // send email
        await sendVerificationEmail(body.email, email_token);

        res.json({
            msg: "Registered-Check your email to verify",
            token,
            newUser,
            created_token
        })

    } 
    
    catch(e){
        res.json({
            msg: "User already exists",
            error: e
        })
    }

})

router.post("/signin", async (req, res) => {
    const body = req.body

    const isCorrectInput = userSigninZod.safeParse(body)

    if(!isCorrectInput.success){
        res.status(411).json({
            msg: "Incorrect input format"
        })
        return
    }

    try {
        const isValid = await prisma.user.findFirst({
            where: {
                email: body.email,
                password: body.password
            }
        })

        const userId = isValid?.id
        const userRole = isValid?.role

        const token = jwt.sign({
            userId, userRole
        }, JWT_SECRET)

        res.json({
            token,
            isValid
        })
    }

    catch(e){
        res.status(500).json({
            msg: "user doesn't exists",
            error: e
        })
    }
})

router.get("/me", authMiddleware, async (req, res) => {

    //const userId = req.userId ? parseInt(req.userId) : undefined

    if (!req.userId) {
        return res.status(401).json({ msg: "User not authenticated" });
    }

    try{
        const userDetails = await prisma.user.findFirst({
            where: {
                id: parseInt(req.userId) 
            }
        })

        res.json({
            userDetails
        })
    }
    catch(e){
        res.json({
            msg: "an unexpected error occurred",
            error: e
        })
    }
    
})

router.put("/update", authMiddleware, async (req, res) => {
    const body = req.body

    const isCorrectInput = userUpdateZod.safeParse(body)

    if(!isCorrectInput.success){
        res.json({
            msg: "Incorrect input type"
        })
        return
    }

    if(!req.userId){
        return res.status(401).json({ msg: "User not authenticated" });
    }

    try {
        const updatedUser = await prisma.user.update({
            where: {
                id: parseInt(req.userId)
            },
            data: {
                password: body.password,
                location: body.location,
                imageUrl: body.imageUrl,
                name: body.name,
                businessName: body.businessName,
                category: body.category
            }
        })

        res.json({
            updatedUser
        })
    }

    catch(e){
        res.json({
            msg: "unexpected error occurred",
            error: e
        })
    }
})

router.delete("/delete", authMiddleware, async (req, res) => {

    if(!req.userId){
        return res.status(401).json({ msg: "User not authenticated" });
    }

    try{
        const deletedUser = await prisma.user.delete({
            where: {
                id: parseInt(req.userId)
            }
        })

        res.json({
            deletedUser
        })
    }

    catch(e){
        res.json({
            msg: "unexpected error",
            error: e
        })
    }
   
})

// Verify route
router.post("/verify", async (req, res) => {
    try{
        const { token, email } = req.body;
        if(!token){
            return res.status(400).json({
                message: "Token missing" 
            });
        } 

        console.log("here is your token: ", token)

        const record = await prisma.emailVerificationToken.findUnique({
            where: {
                token
            }
        });

        console.log("Here is your user detail:", record)

        if(!record){
            res.status(400).json({
                message: "User already verified"
            });  
            return
        }

        if(record.expiresAt < new Date()) {
        // cleanup expired token
            await prisma.emailVerificationToken.delete({ 
                where: {
                    id: record.id
                }
            });

            return res.status(400).json({
                message: "Token expired"
            });
        }

        const findPeople = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        // mark user verified
        await prisma.user.update({
            where: {
                id: record.userId
            }, 
            data: {
                isVerified: true
            }
        });
        // delete token
        await prisma.emailVerificationToken.delete({
            where: {
                id: record.id
            }
        });

        return res.json({
            message: "Email verified",
            findPeople
        });
    } 
    catch (err: any) {
        console.error(err);
        return res.status(500).json({
            message: "Server error"
        });
    }
});

// Resend verification (by email)
router.post("/resend-verification", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isVerified) return res.status(400).json({ message: "Already verified" });

    // delete old tokens (optional)
    await prisma.emailVerificationToken.deleteMany({ where: { userId: user.id } });

    const token = generateToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await prisma.emailVerificationToken.create({ data: { userId: user.id, token, expiresAt } });

    await sendVerificationEmail(email, token);
    return res.json({ message: "Verification email resent" });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});


export default router