import { Router } from "express";
import { jwtVerification } from "../middlewares/jwtVerification.js";
import { upload } from "../middlewares/multer.middelware.js";
import { deletePost,createPost, likeUnlikePost, commentOnPost, getAllPosts, getLikedPosts, getFollowingPosts } from "../controllers/post.controllers.js";

const postRouter = Router()

//routes 
postRouter.route("/create").post(jwtVerification,
   upload.fields([
    {name:"postImage", maxCount:3} 
   ]), createPost) //local uploading through multer

postRouter.route("/deletepost/:postId").post(jwtVerification,deletePost)
postRouter.route("/likepost/:postId").post(jwtVerification,likeUnlikePost)
postRouter.route("/comment/:postId").post(jwtVerification,commentOnPost)
postRouter.route("/getposts").get(jwtVerification,getAllPosts)
postRouter.route("/liked/:postId").get(jwtVerification,getLikedPosts)
postRouter.route("/following").get(jwtVerification,getFollowingPosts)