import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('MongoDB is Connected Successfully!');
    } catch (error) {
        console.log("Unable to connect MongoDB", error);
        process.exit(1);
    }
}