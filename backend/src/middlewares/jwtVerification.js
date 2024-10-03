import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from 'jsonwebtoken'
import { User } from "../models/user.models.js";

export const jwtVerification = asyncHandler(async(req,res,next) =>{

    //checking if user is logged in by verifying the access token 
     
        //we have access to accessTOken in req.cookies 
        const token = req.cookies?.accessToken
        
        //decoding the token with secret key 
        if(!token) {
            // return res.json({message:"Unauthorized request.User not loggedIn"})
            throw new ApiError(401,"Unauthorized request.User not loggedIn")
        }
        
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

        //finding the user by id and creating a object in req : req.user = user 

        const userDetails = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if(!userDetails) {throw new ApiError(400,"Invalid access tokens ")}
        
        req.user = userDetails

        console.log("\n JWT VERIFY \n" , req.user , "\n*****\n")

        next()
    
})