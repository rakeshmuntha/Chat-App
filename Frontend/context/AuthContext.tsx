import { createContext, useEffect, useState } from "react";
import axios, { type AxiosStatic } from 'axios'
import toast from "react-hot-toast";
import { io, Socket } from 'socket.io-client'

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export interface AuthContextType {
    axios: AxiosStatic;
    authUser: AuthUserType | null;
    onlineUsers: any;
    socket: Socket | null;
    login: (state: any, credentials: any) => void;
    logout: () => void;
    updateProfile: (body: any) => void;
}
export interface AuthUserType {
    _id: string;
    email: string;
    fullName: string;
    password: string;
    profilePic?: string;
    bio: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}
// axios, authUser, onlineUsers, socket, login, logout, updateProfile
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: any) => {
    const [token, settoken] = useState(localStorage.getItem("token"));
    const [authUser, setauthUser] = useState<AuthUserType | null>(null);
    const [onlineUsers, setonlineUsers] = useState<any>([]);
    const [socket, setsocket] = useState<Socket | null>(null);

    // check if the user is authenticated and if so, set the user data and connect the socket
    const checkAuth = async () => {
        try {
            const { data } = await axios.get("/api/auth/check");
            if (data.success) {
                setauthUser(data.user);
                connectSocket(data.user);
            }
        }
        catch (error: any) {
            toast.error(error.message)
        }
    }

    // connect socket function to handle socket connection and online users updates
    const connectSocket = (userData: any) => {
        if (!userData || socket?.connected) return;
        const newSocket = io(backendUrl, {
            query: {
                userId: userData._id,
            }
        });
        newSocket.connect();
        setsocket(newSocket);

        newSocket.on("getOnlineUsers", (userIds) => {
            setonlineUsers(userIds);
        })
    }

    // login function to handle user authentication and socket connection
    const login = async (state: any, credentials: any) => {
        try {
            const { data } = await axios.post(`/api/auth/${state}`, credentials);
            if (data.success) {
                setauthUser(data.userData);
                connectSocket(data.userData);
                axios.defaults.headers.common["token"] = data.token;
                settoken(data.token);
                localStorage.setItem("token", data.token);
                toast.success(data.message);
            }
            else toast.error(data.message);
        }
        catch (error: any) {
            toast.error(error.message);
        }
    }

    // logout function to handle user logout and socket disconnection
    const logout = async () => {
        localStorage.removeItem("token");
        settoken(null);
        setauthUser(null);
        setonlineUsers(null);
        axios.defaults.headers.common["token"] = null;
        toast.success("Logged out successfully");
        socket?.disconnect();
    }

    // update profile function to handle user profile updates
    const updateProfile = async (body: any) => {
        try {
            const { data } = await axios.put("/api/auth/update-profile", body);
            if (data.success) {
                setauthUser(data.user);
                toast.success("Profile updated successfully");
            }
        }
        catch (error: any) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["token"] = token;
        }
        checkAuth();
    }, [])

    const value = {
        axios, authUser, onlineUsers, socket, login, logout, updateProfile
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
