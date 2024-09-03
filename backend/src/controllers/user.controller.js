import {asyncHandler} from '../utils/asyncHandler.js'

export const registerUser =  async(req,res,next) =>{
    console.log("Hi Register")
    res.send("Register Reached")
}

export const loginUser = async() =>{

}

export const logoutUser = async() =>{

}

