import { Request, Response, NextFunction } from 'express'
import User from '../model/User';
import jwt from 'jsonwebtoken';
import 'dotenv/config'
import { Document } from 'mongoose';
import { userType } from '../types/userType';

interface AuthRequest extends Request {
    user?: userType;
}
export const protectRoute = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        // const authHeader = req.headers.authorization;
        // if (!authHeader || !authHeader.startsWith('Bearer ')) {
        //     return res.status(401).json({ success: false, message: 'No token provided' });
        // }

        // const token = authHeader.split(' ')[1];
        const token = req.headers.token;
        const decoded = jwt.verify(token as string, process.env.JWT_SECRET as string) as { userid: string };;

        const user: userType & Document | null = await User.findById(decoded.userid).select("-password");
        if (!user) return res.json({ success: false, message: 'User does not Exists' });

        req.user = user;
        next();
    }
    catch (error: any) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}
