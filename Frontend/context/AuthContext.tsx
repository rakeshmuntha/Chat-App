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
    currState: string | null;
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
    const [currState, setcurrState] = useState(null);

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
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            }
            else {
                toast.error(error.message);
            }
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
            const promise = axios.post(`/api/auth/${state}`, credentials);

            toast.promise(promise, {
                loading: `${state === 'login'? 'LoggingIn' : 'SigningIn'}... Please wait`,
                success: `${state === 'login'? 'Login' : 'Signup'} Successful`,
            });

            const { data } = await promise;

            if (data.success) {
                setcurrState(state);
                setauthUser(data.userData);
                connectSocket(data.userData);
                axios.defaults.headers.common["token"] = data.token;
                settoken(data.token);
                localStorage.setItem("token", data.token);            
            }
            else toast.error(data.message);
        }
        catch (error: any) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            }
            else {
                toast.error(error.message);
            }
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
            const promise = axios.put("/api/auth/update-profile", body);
            toast.promise(promise, {
                loading: 'Updating...',
                success: `Profile updated successfully`,
            });

            const { data } = await promise;
            if (data.success) {
                setauthUser(data.user);
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
        axios, authUser, onlineUsers, socket, login, logout, updateProfile, currState
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
