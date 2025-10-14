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

// initialize socket.io server 
export const io = new Server(server, {
    cors: { origin: "*" }
});

// store online users (logged-in)
export const userSoketMap: Record<string, string> = {}; // { userId: socketId }

// anonymous structures
const anonymousQueue: Array<any> = []; // queue of sockets waiting
const anonymousPairs: Record<string, string> = {}; // { socketId: partnerSocketId }

// socket.io connection handler
io.on("connection", (socket) => {
    // note: socket.handshake.query values are strings
    const userId = (socket.handshake.query?.userId as string) || null;
    const isAnonymous = (socket.handshake.query?.isAnonymous as string) === "true";
    const userName = (socket.handshake.query?.userName as string) || null;

    console.log(userId);
    console.log(isAnonymous);
    console.log(userName);
    
    // === Logged-in user handling (existing) ===
    if (userId && !isAnonymous) {
        console.log(`User connected ${userId} -> socket ${socket.id}`);
        userSoketMap[userId] = socket.id;
        // broadcast online users
        io.emit("getOnlineUsers", Object.keys(userSoketMap));
    }

    // === Anonymous user handling ===
    if (isAnonymous) {
        console.log(`Anonymous socket connected: ${socket.id} and userName: ${userName}`);

        // push socket into waiting queue
        (socket as any).name = userName;
        anonymousQueue.push(socket);

        // attempt to pair if >= 2 waiting
        tryPairAnonymousUsers();
    }

    // === Shared events ===

    // Anonymous message event (room-based)
    socket.on("anonymous_message", ({ roomId, message }: { roomId: string, message: string }) => {
        // broadcast to the room AND include senderSocketId so client can identify sender
        io.to(roomId).emit("anonymous_message", {
            message,
            senderSocketId: socket.id,
            createdAt: new Date().toISOString()
        });
    });

    // Optional: Allow a client to explicitly leave anonymous chat (e.g., "Exit" button)
    socket.on("anonymous_leave", ({ roomId }: { roomId?: string }) => {
        handleAnonymousLeave(socket, roomId);
    });

    // handle disconnect for both logged-in and anonymous
    socket.on("disconnect", (reason) => {
        console.log(`Socket disconnected ${socket.id} reason: ${reason}`);

        // cleanup for logged-in
        if (userId && !isAnonymous) {
            delete userSoketMap[userId];
            io.emit("getOnlineUsers", Object.keys(userSoketMap));
        }

        // cleanup for anonymous: remove from queue, notify partner
        if (isAnonymous) {
            // remove from waiting queue (if present)
            const idx = anonymousQueue.findIndex((s) => s.id === socket.id);
            if (idx !== -1) anonymousQueue.splice(idx, 1);

            // if paired, notify partner
            const partnerId = anonymousPairs[socket.id];
            if (partnerId) {
                const partnerSocket = io.sockets.sockets.get(partnerId);
                if (partnerSocket) {
                    partnerSocket.emit("anonymous_end", { reason: "Partner left" });
                    // optionally force partner to leave room
                    // You might want to cleanup partnerSocket.rooms manually if needed
                }
                // delete both sides mapping
                delete anonymousPairs[partnerId];
                delete anonymousPairs[socket.id];
            }
        }
    });
});

// ------------------------
// Helper functions
// ------------------------
function tryPairAnonymousUsers() {
    // pair as many as possible (FIFO)
    while (anonymousQueue.length >= 2) {
        const user1 = anonymousQueue.shift();
        const user2 = anonymousQueue.shift();

        if (!user1 || !user2) break; // safety

        const roomId = `anon_room_${user1.id}_${user2.id}`; // unique room
        user1.join(roomId);
        user2.join(roomId);

        // map partners for cleanup
        anonymousPairs[user1.id] = user2.id;
        anonymousPairs[user2.id] = user1.id;

        // store current room on sockets (optional helpful flag)
        (user1 as any).currentAnonRoom = roomId;
        (user2 as any).currentAnonRoom = roomId;

        // notify both clients
        user1.emit("anonymous_paired", { roomId, partnerSocketId: user2.id, partnerName: user2.name });
        user2.emit("anonymous_paired", { roomId, partnerSocketId: user1.id, partnerName: user1.name });

        console.log(`Paired anonymous: ${user1.id} ${user1.name} <-> ${user2.id} ${user2.name} (room: ${roomId})`);
    }
}

function handleAnonymousLeave(socket: any, roomId?: string) {
    // if roomId provided, use it, otherwise check socket.currentAnonRoom
    const rId = roomId || socket.currentAnonRoom;
    if (!rId) return;
    // notify the room that chat is ending
    io.to(rId).emit("anonymous_end", { reason: `${socket.name} left`, by: socket.id });

    // find partner and cleanup maps
    const partnerId = anonymousPairs[socket.id];
    if (partnerId) {
        delete anonymousPairs[partnerId];
        delete anonymousPairs[socket.id];

        const partnerSocket = io.sockets.sockets.get(partnerId);
        if (partnerSocket) {
            // remove partner from room
            partnerSocket.leave(rId);
            (partnerSocket as any).currentAnonRoom = undefined;
        }
    }

    // leave the room and cleanup
    socket.leave(rId);
    socket.currentAnonRoom = undefined;
}

// --------------------------------------------------
// Express config & routes (kept from your original)
// --------------------------------------------------
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