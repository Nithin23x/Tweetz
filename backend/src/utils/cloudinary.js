import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_USERNAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

export const cloudUpload = async(filePath) =>{
    try {
        const uploadResponse = await cloudinary.uploader.upload(filePath,
            {resource_type:"auto"}
        )
        return uploadResponse
    } catch (error) {
        console.log("something went wrong in uploading pics")
        fs.unlinkSync(filePath)
        return null 
    }
}