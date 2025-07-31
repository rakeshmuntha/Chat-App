import mongoose from "mongoose";
import 'dotenv/config'

export const connectDb = async (): Promise<any> => {
    try {
        mongoose.connection.on('connected', () => {console.log(`Connected to MongoDB suffessfully✅✅`);})
        await mongoose.connect(`${process.env.MONGODB_URI}/chat-app`);
    } 
    catch (error) {
        console.log(`Failed to connect to MongoDB❌❌`);
        console.log(error);   
    }
}