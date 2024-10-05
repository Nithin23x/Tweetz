import { Notification } from "../models/notification.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getNotifications = asyncHandler(async(req,res) => {
    const userId = req.user._id
    const notifications = await Notification.find({to:userId}).populate(
        {
            path:"from",
            select:"profileImage username"
        }
    ) //getting all notifications of to userId

    await Notification.updateMany({to:userId},{read:true})

    return res.status(200).json(
        new ApiResponse(200,notifications,"Notifications fetched")
    )

})

export const deleteNotifications = asyncHandler(async() => {
    const userId = req.user._id
    await Notification.deleteMany({to:userId})

    res.status(200).json({message:"Notifications Deleted"})
})