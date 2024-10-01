import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    password:{
        type:String,
        required:[true,"Password is required"],
        trim:true,
    },
    fullName:{
        type:String,
        required:true,
        trime:true
    },
    followers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            default:[]
        }
    ],
    following:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            default:[]
        }
    ],
    profileImage:{
        type:String,
        default:'' //url from cloudinary 
    },
    coverImage:{
        type:String,
        default:"" //url from cloudinary 
    },
    bio:{
        type:String,
        default:''
    },
    refreshToken:{
        type:String,
        default:''
    }
},{timestamps:true})

 
//for saving and hasing the password we use "pre hook" which allows us to save password just before
//mongoDB operation 

//we don't use arrow function here because they dont have access to "this"
userSchema.pre("save", async function(next) {
    //since we have access to this, if password is not modified then we return to next()
    //this function just before the user.createone() 
    
    if(!this.isModified("password")) {return next()}

    this.password = await bcrypt.hash(this.password, 10) //this is crypto operation requires times so awaited
    next()   
})


//user defined methods 

userSchema.methods.isPasswordCorrect = async function(givenPassword) {
    //compare passwords with bcrypt.compare(). compare() is already a function in bcrypy library

    return await bcrypt.compare(givenPassword,this.password) //await for crypto methods 

}

userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id:this._id,
            username:this.username, //PAYLOAD
            email:this.email
        },
        process.env.ACCESS_TOKEN_SECRET, //SECRET KEY
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY //OPTIONS
        }
    )
}

userSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        {
            _id:this._id, //payload
        },
        process.env.REFRESH_TOKEN_SECRET, //SECRET KEY
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY //OPTIONS
        }
    )
}
export const User = mongoose.model("User",userSchema)