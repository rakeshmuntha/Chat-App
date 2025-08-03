import express from 'express';
import { protectRoute } from '../middleware/auth';
import { getMessages, getUsersForSidebar, markMessagesAsSeen } from '../controller/messageController';


const messageRouter = express.Router();

messageRouter.get('/users', protectRoute, getUsersForSidebar);
messageRouter.get('/:id', protectRoute, getMessages);
messageRouter.put('/mark/:id', protectRoute, markMessagesAsSeen);

export default messageRouter;