import express from "express"
import userRouter from "./user"
import listingRouter from "./listing"
import chatController from "../controllers/chatController"

const router = express.Router()

router.use("/user", userRouter)
router.use("/listing", listingRouter)
router.use("/chat", chatController)


router.get("/inside", (req, res) => {
    res.json({
        msg: "HI from the inside router"
    })
})

export default router