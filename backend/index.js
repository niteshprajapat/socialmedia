import express from 'express';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import { connectDB } from './config/connection.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import messageRoute from './routes/messageRoute.js';


// Config
dotenv.config();
connectDB()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})


// Variables
const app = express();
const port = process.env.PORT;


// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: [process.env.FRONTEND_URL],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

// Routes Middlewares
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/messages', messageRoute);


// App HomePage
app.get('/', (req, res) => {
    return res.status(200).json({
        success: true,
        message: 'This is HomePage of SocialMedia',
    });
})

// App Listen
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})