import jwt from 'jsonwebtoken'
import 'dotenv/config'
export const generateToken = (userid: string): string => {
    const token = jwt.sign({userid}, process.env.JWT_SECRET as string);
    return token;
}