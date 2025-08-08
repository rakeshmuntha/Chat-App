import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import http from 'http';
import { connectDb } from './lib/db';
import userRouter from './routes/userRoutes';
import messageRouter from './routes/messageRoutes';
import { Server } from 'socket.io';

const app = express();
const PORT = process.env.port || 3001;
const server = http.createServer(app);

// initialize soket.io server 
export const io = new Server(server, {
    cors: {origin: "*"}
})

// store online users
export const userSoketMap: any = {}; // {userId : soketId}

// socket.io connection handler
io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log(`user connected ${userId}`);
    if(userId) userSoketMap[userId as string] = socket.id;

    // emit online users to all connected client
    io.emit("getOnlineUsers", Object.keys(userSoketMap));

    socket.on("disconnect", () => {
        console.log(`User Disconnected`, userId);
        delete userSoketMap[userId as string];

        io.emit("getOnlineUsers", Object.keys(userSoketMap));
    })
})

app.use(express.json({ limit: "4mb" }));
app.use(cors());

// Routes
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

connectDb();

app.get('/', (req, res) => {
    res.json('Backend running!');
});

server.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});

// • npm run dev – starts dev server with reload
// • npm run build – compiles TypeScript to JS
// • npm start – runs compiled backend