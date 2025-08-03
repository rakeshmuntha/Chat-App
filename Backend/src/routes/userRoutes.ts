import { sign } from 'crypto';
import express from 'express'
import { checkAuth, login, signup, updateProfile } from '../controller/userController';
import { protectRoute } from '../middleware/auth';
const userRouter = express.Router();

userRouter.post('/signup', signup);
userRouter.post('/login', login);
userRouter.get('/check', protectRoute, checkAuth);
userRouter.put('/update-profile', protectRoute, updateProfile);


export default userRouter;