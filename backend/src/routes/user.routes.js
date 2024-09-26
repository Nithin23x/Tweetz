import { Router } from "express";
import { registerUser,loginUser,logoutUser, getMe } from "../controllers/user.controller.js";
import { jwtVerification } from "../middlewares/jwtVerification.js";

const userRouter = Router()

userRouter.route("/register").post(registerUser)  // here we are giving each controllers for every sub-user routes 
userRouter.route("/login").post( loginUser)
userRouter.route("/logout").post(jwtVerification,logoutUser)
userRouter.route("/getMe").get(jwtVerification,getMe)


export {userRouter}