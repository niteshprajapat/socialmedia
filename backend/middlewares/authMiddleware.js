import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

export const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        //  || req.headers.authorization.replace("Bearer ", "");

        if (!token) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized, Please Login First",
            });
        }

        const decoded = await jwt.verify(token, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });

        if (!decoded) {
            return res.status(403).json({
                success: false,
                message: "Invalid Token",
            });
        }

        const userId = decoded?._id;

        const user = await User.findById(userId);

        req.user = user;

        next();

    } catch (error) {
        console.log(error);
    }
}