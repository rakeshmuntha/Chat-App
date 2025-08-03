import mongoose, { Document } from "mongoose";
import { userType } from "../types/userType";

const userSchema = new mongoose.Schema<userType & Document>({

    email: {type: String, required: true, unique: true},
    fullName: {type: String, required: true},
    password: {type: String, required: true, minlength: 3},
    profilePic: {type: String, default: ''},
    bio: {type: String},
    
}, {timestamps: true})

const User = mongoose.model<userType & Document>("User", userSchema);
export default User;