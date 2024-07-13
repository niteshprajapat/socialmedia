import User from "../models/userModel.js";
import getDataUrl from "../utils/urllGenerator.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';



// register
export const register = async (req, res) => {
    try {
        const { name, email, password, gender } = req.body;
        const file = req.file;

        if (!name || !email || !password || !gender || !file) {
            return res.status(404).json({
                success: false,
                message: "All Fields are Required!",
            });
        }


        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User Already Exists",
            });
        }


        const fileUrl = getDataUrl(file);

        const hashedPassword = await bcrypt.hash(password, 10);

        const cloudinaryResponse = await cloudinary.uploader.upload(fileUrl.content);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            gender,
            profilePic: {
                id: cloudinaryResponse.public_id,
                url: cloudinaryResponse.secure_url,
            }
        });

        // token
        const token = jwt.sign({ _id: user?._id }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });


        user.password = null;

        return res.status(201).cookie("token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            sameSite: "strict",
        }).json({
            success: true,
            message: "User Registered Successfully.",
            user,
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error in Register API",
        });
    }
}

// login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(404).json({
                success: false,
                message: "All Fields are Required!",
            });
        }


        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User Not Found!",
            });
        }

        const isMatchedPassword = await bcrypt.compare(password, user.password);
        if (!isMatchedPassword) {
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials!",
            });
        }

        // token
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });


        user.password = null;
        return res.status(200).cookie("token", token, {
            // httpOnly: true,
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            // sameSite: "strict",
        }).json({
            success: true,
            message: "User LoggedIn Successfully!",
            token,
            user,
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error in Login API",
        });
    }
}

// logout
export const logout = async (req, res) => {
    try {

        return res.status(200).cookie("token", "", {
            // httpOnly: true,
            expires: new Date(Date.now()),
            // sameSite: "strict",
        }).json({
            success: true,
            message: "User LoggedOut Successfully!",
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error in Logout API",
        });
    }
}