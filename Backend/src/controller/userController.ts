import User from "../model/User";
import { userType } from "../types/userType";
import { Request, Response } from "express";
import bcrypt from 'bcryptjs'
import { generateToken } from "../lib/utils";
import { Document } from "mongoose";
import cloudinary from "../lib/cloudinary";


// SignUp a user http://localhost:3001/api/auth/signup
export const signup = async (req: Request, res: Response) => {
    const { fullName, email, password, bio } = req.body;

    try {
        if (!fullName || !email || !password || !bio) return res.status(404).json({ success: false, message: 'Missing Credentials' });
        const user: userType | null = await User.findOne({ email });

        if (user) return res.status(404).json({ success: false, message: 'Account Already Exists' });

        const salt: string = await bcrypt.genSalt(10);
        const hashedPassword: string = await bcrypt.hash(password, salt);

        const newUser: userType & Document = await User.create({ fullName, email, password: hashedPassword, bio });

        const token: string = generateToken(newUser._id as string);
        res.json({ success: true, userData: newUser, token, message: 'Account created Successfully' })
    }

    catch (error: any) {
        console.log(error.message);
        res.status(404).json({ success: false, message: error.message })
    }
}

// Login a User http://localhost:3001/api/auth/login
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const userData: userType & Document | null = await User.findOne({ email });
        if (userData == null) return res.status(404).json({ success: false, message: 'User does not Exists' });

        const ispasswordCorrect: boolean = await bcrypt.compare(password, userData.password)
        if (!ispasswordCorrect) return res.status(404).json({ success: false, message: 'Wrong Password' });

        const token: string = generateToken(userData._id as string);
        res.json({ success: true, userData: userData, token, message: 'Login Successful' })
    }

    catch (error: any) {
        console.log(error.message);
        res.status(404).json({ success: false, message: error.message })
    }
}

interface reqUser extends Request {
    user?: userType & Document
}

// Check if user is authenticated
export const checkAuth = async (req: reqUser, res: Response) => {
    res.json({ success: true, user: req.user });
}

// Update user Profile details http://localhost:3001/api/auth/update-profile
export const updateProfile = async (req: reqUser, res: Response) => {
    try {
        const { profilePic, bio, fullName } = req.body;
        if (!req.user) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }
        const userid = req.user._id;
        let updateduser: userType | null;

        if (!profilePic) {
            updateduser = await User.findByIdAndUpdate(userid, { bio, fullName }, { new: true })
        }
        else {
            const upload = await cloudinary.uploader.upload(profilePic);
            updateduser = await User.findByIdAndUpdate(userid, { profilePic: upload.secure_url, bio, fullName }, { new: true });
        }
        res.json({ success: true, user: updateduser });
    }
    catch (error: any) {
        console.log(error.message);
        res.status(404).json({ success: false, message: error.message })
    }
}

