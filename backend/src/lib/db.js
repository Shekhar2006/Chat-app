import mongoose from "mongoose";
import "dotenv/config";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to mongodb!");
    } catch (error) {
        console.log("Error while connecting to mongodb.",error);
    }
};
