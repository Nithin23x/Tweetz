import { Notification } from "../models/notification.model.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { cloudUpload } from "../utils/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";

export const createPost = asyncHandler(async(req,res) =>{
    //creating the post 
	const {text:caption , img:postImageLocalPath} = req.body;
    const userId = req.user._id.toString() //getting the deatils of authenticated user 

    const postingUser = await User.findById(userId).select("-password -refreshToken")

	if (!postingUser) return res.status(404).json({ message: "User not found" });
    if(!caption) return res.status(404).json({message:"No caption"}) 

    //post Image
    if(!postImageLocalPath) return res.status(404).json({error:"Something went wrong"})

    const postImageUpload = await cloudUpload(postImageLocalPath)
    if(!postImageUpload) return res.status(404).json({error:"Something went wrong"})

    const newPost = await Post.create({
        user:userId,
        caption,
        postImage:postImageUpload.secure_url
    })

   if(!newPost){
    return res.json({error:"Post creation failed"})
    //throw new ApiError(500,"Post creation failed")
   }

   return res.status(200).json( 
    new ApiResponse(200,newPost,"Post created Successfully")
   );
})

export const deletePost = asyncHandler(async(req,res) =>{
    const {postId} = req.params  //getting the postId from the param and finding the post by id 
    const findPost = await Post.findById(postId)

    if(!findPost) {return res.status(404).json({error:"Post not found"})}

    if(findPost.user.toString() !== req.user._id.toString()) { //checking if deleting user owns the post or not 
        return res.status(404).json({error:"You are not allowed to delete this post"})
    }

    if (findPost.postImage) {
        const imgId = findPost.postImage.split("/").pop().split(".")[0]; //deleting the post in cloudinary with id
        await cloudinary.uploader.destroy(imgId);
    }

    await Post.findByIdAndDelete(postId)

    return res.status(200).json(
        new ApiResponse(200,"","Post deleted")
    )

})

export const commentOnPost = async (req, res) => {
	try {
		const { text } = req.body;
		const {postId} = req.params;
		const userId = req.user._id;

		if (!text) {
			return res.status(400).json({ error: "Text field is required" });
		}
		const post = await Post.findById(postId);

		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const comment = { user: userId, text };

		post.comments.push(comment) //pushing the comment(obj) into comment array 
		await post.save({validateBeforeSave:false}); //saving it without triggering any validation(s) hooks like "save"

		res.status(200).json(post);
	} catch (error) {
		console.log("Error in commentOnPost controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const likeUnlikePost = asyncHandler(async(req,res) =>{
	
		const userId = req.user._id; //from jwtverification
		const {  postId } = req.params;  //from params :/postId

		const post = await Post.findById(postId);

		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const userLikedPost = post.likes.includes(userId); //checking if user liked post 

		if (userLikedPost) { //if user already liked then unlike post
			// Unlike post
			await Post.findByIdAndUpdate(postId, {$pull:{likes:userId}})
			await User.findByIdAndUpdate(userId, {$pull:{likedPosts:postId}}) 

			const updatedLikes = post.likes.filter((id) => id.toString() !== userId.toString());
			res.status(200).json(updatedLikes);
		} else {
			// Like post
			post.likes.push(userId)
			await User.findByIdAndUpdate(userId, {$push :{likedPosts:postId}})
			await post.save({validateBeforeSave:false})

			const notification = await Notification.create({
				from:userId,
				to:post.user,
				type:"Like"
			})

			const updatedLikes = post.likes;
			return res.status(200).json(updatedLikes);
		}
	
})

export const getAllPosts = asyncHandler( async() =>{
	const posts = await Post.find()  //post.find() returns all the posts 
			.sort({ createdAt: -1 })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "-password",
			});

		if (posts.length === 0) {
			return res.status(200).json([]);
		}
	const allPosts = await Post.find().sort({createdAt:-1}).populate( //populate it's a extension of a object in the DB
		{
			path:"user",
			select:"-password"
		},
		{
			path:"comments.user",
			select:"-password"
		}

	)
	if(allPosts.length === 0){
		return res.status(200).json([])
	}
 

	return res.status(200).json(
		new ApiResponse(200,allPosts,"Posts fetched")
	);
	
})

export const getLikedPosts = asyncHandler(async(req,res) =>{
	//1.get the userId from params
	// 2.check if user exists or not 
	// 3.find the posts according to the likedPosts array.In that we have array of post id's 
	//finding of posts is done by the $in method 

	const {userId} = req.params
	const user = await User.findById(userId)
	if(!user) {throw new  ApiError(404,"User not found" )}

	//here in find() we are finding all the posts based on _id and that _id is in likedpost[] of user so we need to get that _id's, we used $in operator
	//note:- Post.find() returns all the posts in collection
	//note :- Post.find().sort({createdAt:-1}) returns all the posts in collection which are created recent order
	//note :- Post.find({_id}) //searhed based on _id given to it , in the same way Post.find({user}) finds the based on user 

	const userLikedPost = await Post.find({_id : {$in : user.likedPosts}}).populate(
		{
			path:"user",
			select:"-password"
		}).populate(
			{
				path:"comments.user",
				select:"-password"
			}
		)
	

	return res.status(200).json(
		new ApiResponse(200,userLikedPost,"liked posts of the user")
	)


})


export const getFollowingPosts = asyncHandler( async(req,res) => {
	//get the posts of the users that current(jwt-verify) users follows

	const userId = req.user._id
	const userExists = await User.findById(userId)
	if(!userExists) {throw new ApiError(404,"User not found")}

	//finding the posts based on following of the current users,so we pass user.following in find()

	const followingPosts = await Post.find({user: {$in : userExists.following}}).sort({createdAt:-1}).populate(
		{
			path:"user",
			select:"-password"
			
		}
	).populate({
		path:"comments.user",
		select:"-password"
	})

	return res.status(200).json(
		new ApiResponse(200,followingPosts,"Feed posts")
	)

})

export const getUserPosts = asyncHandler( async() =>{
	const {username} = req.params
	const userExists = await User.findOne({username})

	if(!userExists) {throw new ApiError(404,"User not found")}
	
	const userPosts = await Post.find({user: userExists._id}).sort({createdAt:-1}).populate(
		{
			path:"user",
			select:"-password"
			
		}
	).populate({
		path:"comments.user",
		select:"-password"
	})

	return res.status(200).json(
		new ApiResponse(200,userPosts,`fetched posts of ${username}`)
	)
})