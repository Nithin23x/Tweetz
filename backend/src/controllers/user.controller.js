import {asyncHandler} from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { User } from '../models/user.models.js'
import { ApiResponse } from '../utils/ApiResponse.js'


export const generateAccessAndRefreshToken = async function(userId) {
    //find the user from _id and execute the access and refresh token methods attached to it 
    const userDetails = await User.findById(userId)

    const accessToken = userDetails.generateAccessToken()
    const refreshToken = userDetails.generateRefreshToken()
    userDetails.refreshToken = refreshToken

    return {accessToken,refreshToken} 
}

export const registerUser =  asyncHandler( async(req,res) =>{
    //we asynceHandler to handle the async request in form of a Promise 

    //Registering the User into the app 
    //Steps 1.Get the data from req.body 
    //2.check if the {email, fullname , password fields are not empty }
    //3.check if {email or username } already exists.If already exists then throw error
    //4.As we are using cloudinary as image uploader we need to check for img/video files and upload them to cloudinary 
    //5.Hash the password with bcrypt lib
    //6.Create a User Object with User.createOne() mongoDB method with all necessary parameters in user.models.js 
    //  username,email,password,imgurl,coverimageUrl,bio etc 
    //7.Send the response to the User 

    //Global Rule Use "await" whenever there is DB call 

    //1.Get the data from the req.body 
    const{email,fullName,username,password} = req.body

    console.log(email,fullName)

    //2.Validation/Checking the data email, fullname , password fields are not empty
    if(
        [username,email,fullName,password].some(eachField => eachField?.trim()=== "")
    ){
        throw new ApiError(400,"All fields are reqiuired")
    }

    const existedUser = await User.findOne({ // await because DB is takes time for processing 
        $or:[{username},{email}] //or operator in mongoDB checking if username or email exists
    })

    if(existedUser) {
        throw new ApiError(409,"User Already Exists")
    }

    const newUser = await  User.create({ // await because DB is takes time for processing 
        username,
        fullName,
        password,
        email,

    })

    if(!newUser){
        throw new ApiError(400,"Something went wrong while creating user")
    }

    return res.status(200).json(
        new ApiResponse(200,newUser,"User Registered Successfully") //(statusCode,data,message) in class 
    )
   
})


export const loginUser = asyncHandler(async(req,res) =>{

    //login steps
    //1.get the data from req.body
    //2.check if username,email are empty 
    //3.check if username or email exists in DB
    //4.verify the password 
    //5.generate the access and refresh token 

    //1.Get the data 
    const {username,email,password} = req.body

    //2.Checking the data 
    if([username,email,password].some(eachField => eachField.trim()==="")) {
        throw new ApiError(400,"All fields are required")
    }

    //3.check if username or email exists in DB
    const existedUser = await  User.findOne({ //findOne returns one doc relating to the username/email
        $or :[{username},{email}]
    })

    if(!existedUser) {
        throw new ApiError(400,"User not found")
    }

    //4.Password check
    const passwordCheck = await existedUser.isPasswordCorrect(password)

    //5.Generate Access Token 
    //Send the _id to the generateAccessAndRefreshToken()
    const{accessToken ,refreshToken} = await  generateAccessAndRefreshToken(existedUser._id)
    console.log(accessToken,refreshToken) 

    res.status(200)
    .cookie("accessToken", accessToken)
    .cookie("refreshToken",refreshToken)
    .json(
        new ApiResponse(200, {refreshToken},"Success")
    )

})

export const logoutUser = asyncHandler( async(req,res,next) =>{
    //deleting the refresh token and access tokens means user is logged out 
    console.log("logout reached ")
    const userLogoutDetails = req?.user

    await User.findByIdAndUpdate(
        req.user._id ,
        {
            $set:{
                refreshToken:undefined
            }
        },
        {
            new:true
        }
    )
    cookieOptions = {
        httpOnly:true,
        secure:true
    }

    res.status(200)
    .clearCookie("accessToken",cookieOptions)
    .clearCookie("refreshToken",cookieOptions)
    .json(
        new ApiResponse(200,{},"User Logged Out succesfully ")
    )
    

    console.log(userLogoutDetails)
})

