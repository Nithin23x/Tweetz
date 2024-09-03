import { Router } from "express";
import { registerUser,loginUser,logoutUser } from "../controllers/user.controller.js";

const userRouter = Router()

userRouter.route("/register").get(registerUser)  // here we are giving each controllers for every sub-user routes 
userRouter.route("/login").post(loginUser)
userRouter.route("/logout").post(logoutUser)


export {userRouter}