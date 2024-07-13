import Post from "../models/postModel.js";
import { v2 as cloudinary } from 'cloudinary';
import getDataUrl from "../utils/urllGenerator.js";

// API Handlers




// create post
export const createPost = async (req, res) => {
    try {
        const { caption } = req.body;
        const ownerId = req.user._id;

        const file = req.file;
        const fileUrl = getDataUrl(file);

        let option;

        const type = req.query.type;
        if (type === "reel") {
            option = {
                resource_type: "video",
            };
        } else {
            option = {};
        }


        const cloudinaryResponse = await cloudinary.uploader.upload(fileUrl.content, option);

        const post = await Post.create({
            caption,
            post: {
                id: cloudinaryResponse.public_id,
                url: cloudinaryResponse.secure_url,
            },
            owner: ownerId,
            type,
        });

        return res.status(201).json({
            success: false,
            message: "Post Created Successfully!",
            post,
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error in createPost API",
        });
    }
}

// deletePost
export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post Not Found with this ID",
            });
        }

        if (post.owner.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized! Please Login First",
            });
        }


        // deleteing photo from cloudinary
        await cloudinary.uploader.destroy(post.post.id);

        await post.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Post Deleted Successfully!",
        })




    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error in deletePost API",
        });
    }
}


// getAllPosts
export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find({ type: "post" }).sort({ createdAt: -1 }).populate('owner', "-password");
        const reels = await Post.find({ type: "reel" }).sort({ createdAt: -1 }).populate("owner", "-password");

        return res.status(200).json({
            success: true,
            message: "Fetched All Posts",
            totalPosts: posts.length,
            totalReels: reels.length,
            posts,
            reels,
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error in getAllPosts API",
        });
    }
}

// likeUnlikePost
export const likeUnlikePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post Not Found with this Id",
            });
        }


        if (post.likes.includes(userId)) {
            // Unlike
            await Post.findByIdAndUpdate(postId, { $pull: { likes: userId } }, { new: true });

            await post.save();

            return res.status(200).json({
                success: true,
                message: "Post Unliked Successfully!",
            });

        } else {
            // Like
            await Post.findByIdAndUpdate(postId, { $push: { likes: userId } }, { new: true });

            await post.save();

            return res.status(200).json({
                success: true,
                message: "Post Liked Successfully!",
            });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error in likeUnlikePost API",
        });
    }
}

// commentOnPost
export const commentOnPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id;
        const userName = req.user.name;
        const { comment } = req.body;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post Not Found with this Id",
            });
        }


        post.comments.push({
            user: userId,
            name: userName,
            comment: comment,
        });

        await post.save();

        return res.status(201).json({
            success: true,
            message: "Comment Added Successfully!",
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error in commentOnPost API",
        });
    }
}


// deleteComment
export const deleteComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id;

        const { commentId } = req.body;


        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post Not Found with this Id",
            });
        }

        if (!commentId) {
            return res.status(404).json({
                success: false,
                message: "Please give Comment Id",
            });
        }


        const commentIndex = post.comments.findIndex((item) => item._id.toString() === commentId.toString());

        if (commentIndex === -1) {
            return res.status(400).json({
                success: false,
                message: "Comment Not Found!",
            });
        }

        const comment = post.comments[commentIndex];

        if ((post.owner.toString() === userId.toString()) || (comment.user.toString() === userId.toString())) {
            post.comments.splice(commentIndex, 1);
            await post.save();

            return res.status(200).json({
                success: true,
                message: "Comment Deleted Successfully!",
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "You are nott allowed to delete this comment!",
            });
        }



    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error in deleteComment API",
        });
    }
}

// editPost
export const updatePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id;

        const { caption } = req.body;


        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post Not Found with this Id",
            });
        }

        if (post.owner.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not owner of this Post!",
            });
        }


        post.caption = caption;

        await post.save();

        return res.status(200).json({
            success: true,
            message: "Post Updated Successfully!",
            post,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error in editPost API",
        });
    }
}