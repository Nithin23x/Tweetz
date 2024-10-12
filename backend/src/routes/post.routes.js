import { Router } from "express";
import { jwtVerification } from "../middlewares/jwtVerification.js";
import { upload } from "../middlewares/multer.middelware.js";
import { deletePost,createPost, likeUnlikePost, commentOnPost, getAllPosts, getLikedPosts, getFollowingPosts } from "../controllers/post.controllers.js";

const postRouter = Router()

//routes 
postRouter.route("/create").post(jwtVerification,
   upload.fields([
    {name:"postImage", maxCount:1} 
   ]), createPost) //local uploading through multer 

//:postId is params common for controllers deletePost,likePost,commentOnPost

postRouter.route("/delete/:postId").delete(jwtVerification,deletePost)
postRouter.route("/likepost/:postId").post(jwtVerification,likeUnlikePost)
postRouter.route("/comment/:postId").post(jwtVerification,commentOnPost)
postRouter.route("/getposts").get(jwtVerification,getAllPosts)
postRouter.route("/liked/:userId").get(jwtVerification,getLikedPosts);
postRouter.route("/following").get(jwtVerification,getFollowingPosts)

export {postRouter}