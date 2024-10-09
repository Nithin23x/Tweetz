import { Router } from "express";
import { registerUser,loginUser,logoutUser, getMe, changeCurrentPassword, updateAccountDetails } from "../controllers/user.controller.js";
import { jwtVerification } from "../middlewares/jwtVerification.js";
import { upload } from "../middlewares/multer.middelware.js";

const userRouter = Router()

//sub-routes for "/api/v1/user"
userRouter.route("/register").post(
    upload.fields([ //multer injected as a middleware 
        //upload.fields() catches it as a "name" in form and also can upload multiple files with maxCount.
        {
            name:"profileImage", maxCount:1
        },{
            name:"coverImage", maxCount:1
        }
    ]),
    registerUser)  // here we are giving each controllers for every sub-user routes 
userRouter.route("/login").post( loginUser) 
userRouter.route("/logout").post(jwtVerification,logoutUser)
userRouter.route("/getMe").get(jwtVerification,getMe) //only login users can access the website it is going to be useful in routing for frontend.
userRouter.route("/changepassword").post(jwtVerification,changeCurrentPassword)
userRouter.route("/update").post(jwtVerification,updateAccountDetails) 

export {userRouter}