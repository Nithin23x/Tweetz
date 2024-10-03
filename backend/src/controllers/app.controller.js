import { Notification } from "../models/notification.model.js";
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
    }

    res.status(200)
    .json(
        new ApiResponse(200,userProfile,"User fetched")
    )
})

export const followUnfollowuser = asyncHandler( async(req,res) =>{
    const {userId} = req.params 
    console.log(userId , "User ID \n")
    console.log(req.user, "Current user \n")

    const {_id,username,email,followers,following} = req.user //current user 
    
    if(userId === req.user._id.toString()) {
         res.json({message : "U cant follow urself "})
        throw new ApiError(400,"You can't follow urself") 
    }

    const userToModify = await User.findById(userId)
    
    const isFollowing = following.includes(userId)  //current user following[] contains userId or not 

    if(isFollowing) {
        //if user is already following then unfollow the user. pull means removing the element from array
        //current user unfollowed userToModify
        await User.findByIdAndUpdate(userId, { $pull: { followers: _id } }); //deleting the _id from userToModify
		await User.findByIdAndUpdate(_id /*current user*/, { $pull: { following: userId } }); //deleting the _id from current user following 

			res.status(200).json({ message: "User unfollowed successfully" });
    }    
    else {
        //current user followed userToModify
        await User.findByIdAndUpdate(userId, { $push: { followers: _id } });
		await User.findByIdAndUpdate(_id, { $push: { following: userId } });
        //send notification on followiing user 

        const followNotification =  await Notification.create({
            type:"follow",
            from:_id,
            to:userId
        }) ;

        await followNotification.save({validateBeforeSave:false})  // it only lets save the document does not trigger any "save" methods associated to it 
        res.status(200).json({message:`U followed ${userId}`})
    }


})

export const getSuggestedusers = asyncHandler( async(req,res) => {
    const userId = req.user._id;
    const usersFollowedByMe = await User.findById(userId).select("following"); //we get the users we're following

    const users = await User.aggregate([
        {
            $match: {
                _id: { $ne: userId }, //ne- not equal to i.e userId not equal to _id
            },
        },
        { $sample: { size: 10 } },
    ]); //we get a 10 sample users which are not curent user 

   

    const filteredUsers = users.filter((user) => !usersFollowedByMe.following.includes(user._id)); 
    //removing the users who are already followed by current user

    const suggestedUsers = filteredUsers.slice(0, 4); //limiting the size to 5 users 

})


export const changeCurrentPassword = asyncHandler(async(req,res ) =>{
    const {oldPassword,newPassword} = req.body

    //checking the old password tru or not 
    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = user.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect) {
        throw new ApiError(400,"Invalid Password")
    }

    user.password = newPassword
    await user.save({validateModifiedOnly})

    return res
    .status(200)
    .json(
        new ApiResponse(200,{},"New Password set")
    )
})

const updateAccountDetails = asyncHandler(async(req,res) =>{
    //advice:- for any updates relating to files we need to 
    //handle them in separate controllers to reduce the network bandwidth and faster,reliable upadates 

    const {fullName,email} = req.body

    if(!(fullName || email )){
        throw new ApiError(400,"All fields are required ")
    }

    const updatedUser = User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                fullName,email
            }
        },
        {
            new:true  //this will enable the new savings made to the user
        }
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200,updatedUser,"Account updated Successfully")
    )
})






const getUserChannelProfile = asyncHandler(async(req,res) =>{
    //we get the user from router param like "/user/:user"
    const {username} = req.params

    if(!username?.trim()){
        throw new ApiError(400,"User does not exist ")
    }

     //aggregrating on the user 
        const userChannel = await User.aggregate([
            {
                $match:{
                username:username?.toLowerCase()
                }
            },
            {
                $lookup:{ //lookup  joins(left join) the docs based on local and foreign fields attachs them together "as"
                    from:"subscriptions",
                    localField:"_id",
                    foreignField: "channel", // this lookup is to find the subscribers of a (user/channel)
                    as:"subscribers" // to determine the subscribers we need to find docs where the channel is (user channel) 
                }
            },
            {
                $lookup:{
                    from:"subscriptions",
                    localField:"_id",
                    foreignField:"subscriber", //this lookup is to find how many channel(s) does a user subscribed
                    as:"subscribedChannels"

                }
            },
            {
                $addFields:{
                    subscriberCount: {
                        $size:"$subscribers" //size is for determingin the length of the result 
                    },
                    subscribedChannels:{
                        $size:"$subscribedChannels"
                    },
                    isSubscribed:{
                        $cond: {
                            if:{$in: [req.user?._id,"$subscribers.subscriber"]},
                            then:true, // we send a true/false flag to the frontend wether the user is subscribed to the channel or not
                            else:false // we check it by having an if-else-then statement 
                        }
                    }
                }
            },
            {
                $project:{ //project is used to select the fields we want to pass by marking them with flags:1
                    fullName:1, // if flag is 1 then it will be present 
                    username:1,
                    subscriberCount:1,
                    isSubscribed:1,
                    subscribedChannels:1,
                    avatar:1,
                    coverImage:1,
                    email:1,
                }
            }
        ])

     if(!userChannel) {
        throw new ApiError(404,"Channel does not exist")
     }
     console.log(userChannel) 

     return res
     .status(200)
     .json(
        new ApiResponse(200,userChannel,"User Channel fetched")
     )
     
})
