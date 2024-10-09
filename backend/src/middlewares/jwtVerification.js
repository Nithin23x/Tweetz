import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from 'jsonwebtoken'
import { User } from "../models/user.models.js";
//we have access to accessTOken in req.cookies 

export const jwtVerification = asyncHandler(async(req,res,next) =>{

    //checking if user is logged in by verifying the access token 
     
        const token = req.cookies?.accessToken
        
        //decoding the token with secret key 
        if(!token) {
            // return res.json({message:"Unauthorized request.User not loggedIn"})
            console.log("user not logged in ") 
            //throw new ApiError(401,"Unauthorized request.User not loggedIn")
            return res.status(400).json({error: "User not Logged In"});
        }
        
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

        //finding the user by id and creating a object in req : req.user = user 

        const userDetails = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if(!userDetails) {throw new ApiError(400,"Invalid access tokens ")}
        
        req.user = userDetails

        console.log("\n JWT VERIFY \n" , req.user , "\n*****\n")

        next()
    
})