import { Router } from "express";
import { registerUser,loginUser,logoutUser, getMe } from "../controllers/user.controller.js";
import { jwtVerification } from "../middlewares/jwtVerification.js";
import { upload } from "../middlewares/multer.middelware.js";

const userRouter = Router()

userRouter.route("/register").post(
    upload.fields([
        {
            name:"profileImage", maxCount:1
        },{
            name:"coverImage", maxCount:1
        }
    ]),
    registerUser)  // here we are giving each controllers for every sub-user routes 
userRouter.route("/login").post( loginUser)
userRouter.route("/logout").post(jwtVerification,logoutUser)
userRouter.route("/getMe").get(jwtVerification,getMe)


export {userRouter}