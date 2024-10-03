import { Post } from "../models/post.model.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { cloudUpload } from "../utils/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";

export const createPost = asyncHandler(async(req,res) =>{
    //creating the post 
    const {caption} = req.body //getting the user 
    const userId = req.user._id.toString() //getting the deatils of authenticated user 

    const postingUser = await User.findById(userId).select("-password -refreshToken")

	if (!postingUser) return res.status(404).json({ message: "User not found" });
    if(!caption) return res.status(404).json({message:"No caption"}) 

    //post Image
    const postImageLocalPath = req.files?.postImage[0].path 
    if(!postImageLocalPath) return res.status(404).json({error:"Something went wrong"})

    const postImageUpload = await cloudUpload(postImageLocalPath)
    if(!postImageUpload) return res.status(404).json({error:"Something went wrong"})

    const newPost = Post.create({
        user:userId,
        caption,
        postImage:postImageUpload.secure_url
    })

   if(!newPost){
    res.json({error:"Post creation failed"})
    throw new ApiError(500,"Post creation failed")
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

		// post.comments.push(comment);
		post.comments.push(comment)
		await post.save({validateBeforeSave:false});

		res.status(200).json(post);
	} catch (error) {
		console.log("Error in commentOnPost controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const likeUnlikePost = async (req, res) => {
	try {
		const userId = req.user._id;
		const { id: postId } = req.params;

		const post = await Post.findById(postId);

		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const userLikedPost = post.likes.includes(userId);

		if (userLikedPost) {
			// Unlike post
			await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
			await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });

			const updatedLikes = post.likes.filter((id) => id.toString() !== userId.toString());
			res.status(200).json(updatedLikes);
		} else {
			// Like post
			post.likes.push(userId);
			await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
			await post.save();

			const notification = new Notification({
				from: userId,
				to: post.user,
				type: "like",
			});
			await notification.save();

			const updatedLikes = post.likes;
			res.status(200).json(updatedLikes);
		}
	} catch (error) {
		console.log("Error in likeUnlikePost controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getAllPosts = async (req, res) => {
	try {
		const posts = await Post.find()
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

		res.status(200).json(posts);
	} catch (error) {
		console.log("Error in getAllPosts controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getLikedPosts = async (req, res) => {
	const userId = req.params.id;

	try {
		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ error: "User not found" });

		const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "-password",
			});

		res.status(200).json(likedPosts);
	} catch (error) {
		console.log("Error in getLikedPosts controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getFollowingPosts = async (req, res) => {
	try {
		const userId = req.user._id;
		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ error: "User not found" });

		const following = user.following;

		const feedPosts = await Post.find({ user: { $in: following } })
			.sort({ createdAt: -1 })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "-password",
			});

		res.status(200).json(feedPosts);
	} catch (error) {
		console.log("Error in getFollowingPosts controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getUserPosts = async (req, res) => {
	try {
		const { username } = req.params;

		const user = await User.findOne({ username });
		if (!user) return res.status(404).json({ error: "User not found" });

		const posts = await Post.find({ user: user._id })
			.sort({ createdAt: -1 })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "-password",
			});

		res.status(200).json(posts);
	} catch (error) {
		console.log("Error in getUserPosts controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};


