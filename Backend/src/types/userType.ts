import mongoose from "mongoose";

export interface userType {
    
    email: string;
    fullName: string;
    password: string;
    profilePic?: string;
    bio?: string;
}

export interface messageType {
    
    senderId: mongoose.Types.ObjectId;
    receiverId: mongoose.Types.ObjectId;
    text?: string;
    image?: string;
    seen: boolean;
}

