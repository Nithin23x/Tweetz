import { Router } from "express";
import { jwtVerification } from "../middlewares/jwtVerification.js";
import { upload } from "../middlewares/multer.middelware.js";

const postRouter = Router()

//routes 
postRouter.route("/createPost/:postUser").post(jwtVerification, //only authenticated users are allowed to post
   upload.fields([
    {name:"postImage", maxCount:3} 
   ]) ,
   createPost) //local uploading through multer  