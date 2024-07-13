import User from "../models/userModel.js";
import getDataUrl from '../utils/urllGenerator.js'
import { v2 as cloudinary } from 'cloudinary';
import bcrypt from 'bcrypt';

// Profile
export const meProfile = async (req, res) => {
    try {

        const userId = req.user._id;

        const user = await User.findById(userId).select("-password");

        return res.status(200).json({
            success: true,
            message: "Fetched User Profile",
            user,
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error in meProfile API",
        });
    }
}

// UserById
export const userById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(404).json({
                success: false,
                message: "Id Not Found",
            });
        }

        const user = await User.findById(id).select("-password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Not Found!",
                user,
            })
        }

        return res.status(200).json({
            success: true,
            message: "Fetched User Profile By Id",
            user,
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error in userById API",
        });
    }
}


// followUnFollow User
export const followUnFollowUser = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const userId = req.params.id;

        const loggedInUser = await User.findById(loggedInUserId);
        const user = await User.findById(userId);

        if (loggedInUser._id.toString() === user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: "You can't follow yourself!",
            });
        }


        if (loggedInUser.following.includes(userId)) {
            // UnFollow
            await User.findByIdAndUpdate(
                loggedInUserId,
                {
                    $pull: {
                        following: userId,
                    },
                },
                { new: true },
            );

            await User.findByIdAndUpdate(
                userId,
                {
                    $pull: {
                        followers: loggedInUserId,
                    },
                },
                { new: true },
            );

            return res.status(200).json({
                success: true,
                message: "User Unfollowed Successfully!",
            });
        } else {
            // Follow
            await User.findByIdAndUpdate(loggedInUserId, { $push: { following: userId } }, { new: true });
            await User.findByIdAndUpdate(userId, { $push: { followers: loggedInUserId } }, { new: true });

            return res.status(200).json({
                success: true,
                message: "User followed Successfully!",
            });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error in followUnFollowUser API",
        });
    }
}

// userFollowerandFollowingData 
export const userFollowerandFollowingData = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId).select("-password")
            .populate("followers", "-password")
            .populate("following", "-password");


        const followers = user.followers;
        const following = user.following;


        return res.status(200).json({
            success: false,
            message: "Fetched User's Followers and Following Data",
            followers,
            following,
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error in userFollowerandFollowingData API",
        });
    }
}

// updateProfile
export const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        const { name } = req.body;

        if (name) {
            user.name = name;
        }

        const file = req.file;
        if (file) {
            const fileUrl = getDataUrl(file);

            await cloudinary.uploader.destroy(user.profilePic.id);

            const cloudinaryResponse = await cloudinary.uploader.upload(fileUrl.content);

            user.profilePic.id = cloudinaryResponse.public_id;
            user.profilePic.url = cloudinaryResponse.secure_url;
        }

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile Updated Successfully!",
            user,
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error in updateProfile API",
        });
    }
}

// updatePassword
export const updatePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        const userId = req.user._id;
        const user = await User.findById(userId);

        const comparePassword = await bcrypt.compare(oldPassword, user.password);
        if (!comparePassword) {
            return res.status(400).json({
                success: false,
                message: "Wrong Old Password",
            });
        }


        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password Updated Successfully!",
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error in updatePassword API",
        });
    }
}

// getAllUsers
export const getAllUsers = async (req, res) => {
    try {
        const loggedInUser = req.user._id;
        const search = req.query.search || "";
        const users = await User.find({
            name: {
                $regex: search,
                $options: "i",
            },
            _id: { $ne: loggedInUser },

        }).select('-password');

        return res.status(200).json({
            success: true,
            message: "Fetched All Users",
            users,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error in getAllUsers API",
        });
    }
}