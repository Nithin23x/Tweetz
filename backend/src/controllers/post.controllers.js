import { Post } from "../models/post.model.js";
import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { cloudUpload } from "../utils/cloudinary.js";

export const createPost = asyncHandler(async(req,res) =>{
    //creating the post 
    const {caption} = req.body //getting the user 
    const userId = req.user._id.toString() //getting the deatils of authenticated user 

    const postingUser = await User.findById(userId).select("-password -refreshToken")

	if (!postingUser) return res.status(404).json({ message: "User not found" });
    if(!caption) return res.status(404).json({message:"No caption"}) 

    //post Image
    const postImageLocalPath = req.files?.postImage[0].path 
    if(!postImageLocalPath) return res.status(404).json({error:"Something went wrong"})

    const postImageUpload = await cloudUpload(postImageLocalPath)
    if(!postImageUpload) return res.status(404).json({error:"Something went wrong"})

    const newPost = Post.create({
        user:userId,
        caption,
        postImage:postImageUpload.secure_url
    })






})