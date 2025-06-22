import mongoose from "mongoose";
import { MONGODB_URL } from "./env.js";

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URL);
        console.log("Database connected");
    } catch (error) {
        console.log(error);
        process.exit(1);

    }
}

export default connectDB;