import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getUserProfile = asyncHandler( async(req,res) =>{
    const {username} = req.params
    console.log(username) 
    const userProfile = await User.findOne({username}).select("-password -refreshToken")

    if(!userProfile) {
        throw new ApiError(400,"User not found")
        res.json("User not found ")
    }

    res.status(200)
    .json(
        new ApiResponse(200,userProfile,"User fetched")
    )
})

export const followUnfollowuser = asyncHandler( async(req,res) =>{
    const {userId} = req.params 
    console.log(userId , "User ID \n")
    console.log(req.user._id, "Current user \n")
    
    if(userId === req.user._id) {
        throw new ApiError(400,"You can't follow urself") 
    }
})
