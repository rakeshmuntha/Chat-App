// server.ts (or server.js) - extended from your original file
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import http from 'http';
import { connectDb } from './lib/db';
import userRouter from './routes/userRoutes';
import messageRouter from './routes/messageRoutes';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);

export const io = new Server(server, {
    cors: { origin: "*" }
});

export const userSoketMap: Record<string, string> = {}; // { userId: socketId }

const anonymousQueue: Array<any> = []; // queue of sockets waiting
const anonymousPairs: Record<string, string> = {}; // { socketId: partnerSocketId }


io.on("connection", (socket) => {

    const userId = (socket.handshake.query?.userId as string) || null;
    const isAnonymous = (socket.handshake.query?.isAnonymous as string) === "true";
    const userName = (socket.handshake.query?.userName as string) || null;
    
    // if SignedIn
    if (userId && !isAnonymous) {
        console.log(`User connected ${userId} -> socket ${socket.id}`);
        userSoketMap[userId] = socket.id;
        // emitting the online users
        io.emit("getOnlineUsers", Object.keys(userSoketMap));
    }


    if (isAnonymous) {
        console.log(`Anonymous socket connected: ${socket.id} and userName: ${userName}`);

        (socket as any).name = userName;
        anonymousQueue.push(socket);

        tryPairAnonymousUsers();
    }

    // this will emit the message sent by the user to the room and the frontend
    socket.on("anonymous_message", ({ roomId, message }: { roomId: string, message: string }) => {
        // go to all the members in roomId
        io.to(roomId).emit("anonymous_message", {
            message,
            senderSocketId: socket.id,
            createdAt: new Date().toISOString()
        });
    });

    // if any of the user leaves, this leaves the other user too
    socket.on("anonymous_leave", ({ roomId }: { roomId?: string }) => {
        handleAnonymousLeave(socket, roomId);
    });

    // if one user disconnected from the server disconnects the other user too
    socket.on("disconnect", (reason) => {
        console.log(`Socket disconnected ${socket.id} reason: ${reason}`);

        if (userId && !isAnonymous) {
            delete userSoketMap[userId];
            io.emit("getOnlineUsers", Object.keys(userSoketMap));
        }

        // cleanup for anonymous: remove from queue, notify partner
        if (isAnonymous) {

            const idx = anonymousQueue.findIndex((s) => s.id === socket.id);
            if (idx !== -1) anonymousQueue.splice(idx, 1);


            const partnerId = anonymousPairs[socket.id];
            if (partnerId) {
                const partnerSocket = io.sockets.sockets.get(partnerId) as any;
                if (partnerSocket) {
                    partnerSocket.emit("anonymous_end", { reason:`${partnerSocket.name} left` });
                }
                delete anonymousPairs[partnerId];
                delete anonymousPairs[socket.id];
            }
        }
    });
});

// ------------------------------------------------------------------------ HELPERS ------------------------------------------------------------------------------------------------ //

// pairs 2 users
function tryPairAnonymousUsers() {

    while (anonymousQueue.length >= 2) {
        const user1 = anonymousQueue.shift();
        const user2 = anonymousQueue.shift();

        if (!user1 || !user2) break; // safety

        const roomId = `anon_room_${user1.id}_${user2.id}`; // unique room
        user1.join(roomId);
        user2.join(roomId);

        anonymousPairs[user1.id] = user2.id;
        anonymousPairs[user2.id] = user1.id;

        (user1 as any).currentAnonRoom = roomId;
        (user2 as any).currentAnonRoom = roomId;

        user1.emit("anonymous_paired", { roomId, partnerSocketId: user2.id, partnerName: user2.name });
        user2.emit("anonymous_paired", { roomId, partnerSocketId: user1.id, partnerName: user1.name });

        console.log(`Paired anonymous: ${user1.id} ${user1.name} <-> ${user2.id} ${user2.name} (room: ${roomId})`);
    }
}

// exits the room 
function handleAnonymousLeave(socket: any, roomId?: string) {

    const rId = roomId || socket.currentAnonRoom;
    if (!rId) return;

    io.to(rId).emit("anonymous_end", { reason: `${socket.name} left`, by: socket.id });

    // find partner and cleanup maps
    const partnerId = anonymousPairs[socket.id];
    if (partnerId) {
        delete anonymousPairs[partnerId];
        delete anonymousPairs[socket.id];

        const partnerSocket = io.sockets.sockets.get(partnerId);
        if (partnerSocket) {

            partnerSocket.leave(rId);
            (partnerSocket as any).currentAnonRoom = undefined;
        }
    }

    socket.leave(rId);
    socket.currentAnonRoom = undefined;
}


app.use(express.json({ limit: "4mb" }));
app.use(cors());

// Routes
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

connectDb();

app.get('/', (req, res) => {
    res.json('Backend running!');
});

// start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});