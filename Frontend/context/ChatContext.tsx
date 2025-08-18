import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

interface ChatContextType {
    messages: any;
    users: any;
    selectedUser: any
    getUsers: () => void;
    setmessages: any;
    sendMessage: (messageData: any) => void;
    setselectedUser: any;
    unseenMessages: any;
    setunseenMessages: any;
    getMessages: (userId: string) => void;
    toggleRightSideBar: () => void;
    selectRightSidebar: boolean;
}


export const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: any) => {

    const context = useContext(AuthContext);
    if (!context) throw new Error("AuthContext is missing. Make sure App is wrapped in AuthProvider.");
    const { socket, axios } = context;

    const [messages, setmessages] = useState<any>([]);
    const [users, setusers] = useState<any>([]);
    const [selectedUser, setselectedUser] = useState<any>(null);
    const [unseenMessages, setunseenMessages] = useState<any>({});
    const [selectRightSidebar, setselectRightSidebar] = useState(false);

    // function to toggle rightsideBar
    const toggleRightSideBar = () => {
        if(selectRightSidebar) setselectRightSidebar(false);
        else setselectRightSidebar(true);
    }

    // function to get all users for sidebar
    const getUsers = async () => {
        try {
            const { data } = await axios.get("/api/messages/users");
            if (data.success) {
                setusers(data.users);
                setunseenMessages(data.unseenMessages);
            }
        }
        catch (error: any) {
            toast.error(error.message);
        }
    }

    // function to get messages for selected user
    const getMessages = async (userId: string) => {
        try {
            const { data } = await axios.get(`/api/messages/${userId}`);
            if (data.success) {
                setmessages(data.messages);
            }
        }
        catch (error: any) {
            toast.error(error.message);
        }
    }

    // function to send messages to selected user
    const sendMessage = async (messageData: any) => {
        try {
            const {data} = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);
            if(data.success) {
                setmessages((prevMessages: any) => [...prevMessages, data.newMessage]);
            }
        } 
        catch (error: any) {
            toast.error(error.message);
        }
    }

    // function to subscribe to messages for selected user
    const subscribeToMessages = async () => {
        if(!socket) return;

        socket.on("newMessage", (newMessage) => {
            if(selectedUser && newMessage.senderId === selectedUser._id) {
                newMessage.seen = true;
                setmessages((prevMessages: any) => [...prevMessages, newMessage]);
                axios.put(`/api/messages/mark/${newMessage._id}`)
            }
            else {
                setunseenMessages((prevUnseenMsgs: any) => ({
                    ...prevUnseenMsgs, [newMessage.senderId] : prevUnseenMsgs[newMessage.senderId] ? prevUnseenMsgs[newMessage.senderId] + 1 : 1
                }))
            }
        })
    }

    // function to unsubscribe from messages
    const unsubscribeFromMessages = () => {if(socket) socket.off("newMessage")};

    useEffect(() => {
        subscribeToMessages();
        return () => unsubscribeFromMessages();
    }, [socket, selectedUser])

    const value = {
        messages, users, selectedUser, getUsers, setmessages, sendMessage, setselectedUser, unseenMessages, setunseenMessages, getMessages, toggleRightSideBar, selectRightSidebar
    }

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}