import { createContext, useState } from "react";
import toast from "react-hot-toast";
// import toast from "react-hot-toast";
import { io, Socket } from 'socket.io-client'


const backendUrl = import.meta.env.VITE_BACKEND_URL;

type Message = {
    text?: string;
    image?: string;
    senderSocketId?: string;
    createdAt?: string;
};

export interface AnonymousContextType {
    socket: Socket | null;
    setSocket: any;
    roomId: String | null;
    setRoomId: React.Dispatch<React.SetStateAction<string | null>>
    paired: boolean;
    setPaired: React.Dispatch<React.SetStateAction<boolean>>;
    input: string;
    setInput: React.Dispatch<React.SetStateAction<string>>;
    messages: Message[];
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>
    startAnonymousChat: (userName: string) => void;
    sendMessage: () => void;
    leaveChat: () => void;
    partnerName: string;
    setpartnerName: React.Dispatch<React.SetStateAction<string>>;
    buttonClick: ()=> void;
    queueCount: number;
    setmyName: React.Dispatch<React.SetStateAction<string>>;
    myName: string
}

// axios, authUser, onlineUsers, socket, login, logout, updateProfile
export const AnonymousContext = createContext<AnonymousContextType | undefined>(undefined);

export const AnonymousProvider = ({ children }: any) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [roomId, setRoomId] = useState<string | null>(null);
    const [paired, setPaired] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [partnerName, setpartnerName] = useState("Anonymous11");
    const [queueCount, setqueueCount] = useState(0);
    const [myName, setmyName] = useState("Anonymous11");

    // call this when user clicks "Chat Anonymously"
    function startAnonymousChat(userName: string) {
        // create a new socket specifically for anonymous chat
        const anonSocket = io(backendUrl, {
            query: { isAnonymous: "true", userName },
            transports: ["websocket"]
        });

        setSocket(anonSocket);

        anonSocket.on("connect", () => {
            console.log("Anonymous socket connected:", anonSocket.id);
        });

        anonSocket.on("anonymous_paired", ({ roomId, partnerName }: { roomId: string, partnerName: string }) => {
            console.log("Paired! room:", roomId);
            toast.success(`Now your are chatting with ${partnerName}`);
            setpartnerName(partnerName);
            setRoomId(roomId);
            setPaired(true);
            setMessages([]); // fresh chat
        });

        anonSocket.on("anonymous_message", ({ message, senderSocketId, createdAt }: any) => {
            setMessages(prev => [...prev, { text: message, senderSocketId, createdAt }]);
        });

        
        // this will ends the chat and sets setpaired to false(based on the paired variable only the chatcontaier displayed to user)
        anonSocket.on("anonymous_end", ({ reason }: any) => {
            console.log("Anonymous chat ended:", reason);
            console.log(socket);
            if(!socket) toast.error(reason);
            else toast.error("you left the chat")
            // show message and cleanup UI if you want
            setPaired(false);
            setRoomId(null);
            // optionally close socket now or keep to queue for new pairing
            // anonSocket.disconnect();
            // setSocket(null);
        });
        
        anonSocket.on("already_queued", (reason) => {
            toast.error(reason);
        })
        
        anonSocket.on("online_queue", (count: number) => {
            setqueueCount(count);
        });

        anonSocket.on("disconnect", () => {
            console.log("Anonymous socket disconnected");
            setPaired(false);
            setRoomId(null);
            setSocket(null);
        });
    }

    function sendMessage() {
        if (!socket || !roomId || !input.trim()) return;
        socket.emit("anonymous_message", { roomId, message: input.trim() });
        setInput("");
    }

    function leaveChat() {
        if (!socket) return;
        socket.emit("anonymous_leave", { roomId });
        socket.disconnect();
        setSocket(null);
        setPaired(false);
        setRoomId(null);
        setMessages([]);
    }

    function buttonClick() {
        console.log("hi thereradfasfasdfafaf");
        if (!socket) return;
        socket.emit("pair_with_newUser", { roomId });

        setMessages([]);
    }

    const value = {
        socket, setSocket, roomId, setRoomId, paired, setPaired, messages, setMessages, input, setInput,
        startAnonymousChat, sendMessage, leaveChat, partnerName, setpartnerName, buttonClick, queueCount, setmyName,myName
    }

    return (
        <AnonymousContext.Provider value={value}>
            {children}
        </AnonymousContext.Provider>
    )
}
