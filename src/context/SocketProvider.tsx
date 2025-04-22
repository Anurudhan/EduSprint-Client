import React, { createContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { RootState } from "../redux";
import { logoutAction } from "../redux/store/actions/auth";
import { ToastService } from "../components/common/Toast/ToastifyV1";
import { Role } from "../types";

interface SocketContextType {
    socket: Socket | null;
    onlineUsers: { userId: string; socketId?: string }[];
    setOnlineUsers: (users: { userId: string; socketId: string }[]) => void;
    currentRoom: string;
    setCurrentRoom: (room: string) => void;
}

interface SocketProviderProps {
    children: React.ReactNode;
}

const SOCKET_BACKEND_URL = import.meta.env.VITE_REACT_APP_SOCKET_BACKEND_URL;
const IS_LOCAL_ENV = import.meta.env.VITE_MODE === 'development';
// const SOCKET_BACKEND_URL = IS_LOCAL_ENV?import.meta.env.VITE_REACT_APP_SOCKET_BACKEND_URL:import.meta.env.VITE_REACT_SOCKET_URL;

export const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const { data } = useAppSelector((state: RootState) => state.user);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<{ userId: string; socketId: string }[]>([]);
    const [currentRoom, setCurrentRoom] = useState<string>("");
    const dispatch = useAppDispatch()

    const contextValues: SocketContextType = {
        socket,
        onlineUsers,
        setOnlineUsers,
        currentRoom, 
        setCurrentRoom,
    };
    const handleLogout = () => {
        // console.log("222222222222222222222222222ahandle logout");
        dispatch(logoutAction());
    };

    useEffect(() => {
        console.log("SocketProvider user data:", data); // check if admin data is present
    console.log("SOCKET_BACKEND_URL", SOCKET_BACKEND_URL); // ensure it's defined
        if ((data?.role === Role.Student || data?.role === Role.Instructor || data?.role ===Role.Admin) && SOCKET_BACKEND_URL) {
            const transports = IS_LOCAL_ENV
                ? ['polling', 'websocket']  // locally
                : ['websocket', 'polling'];            // production

                const newSocket: Socket = io(SOCKET_BACKEND_URL, {
                    path: "/socket.io/",
                    transports: transports,
                    secure: true,
                    withCredentials: true,
                    query: {
                        userId: data._id
                    }
                });

            newSocket.on("connect", () => {
                console.log("Socket connected at client");
                // Send user ID to server immediately after connection
                newSocket.emit("new-user", data._id);
            });

            // Listen for online users updates
            newSocket.on("online-users", (users) => {
                console.log("Online users updated:", users);
                setOnlineUsers(users);
            });

            newSocket.on("disconnect", () => {
                console.log("Socket disconnected");
            });
            // In SocketProvider
            newSocket.on("user-blocked", () => {
                console.log("User has been blocked");
                // Show notification to user
                ToastService.error("Your account has been blocked by an administrator. You will be logged out.");
                // Short delay before logout
                handleLogout();
            
            });
            setSocket(newSocket);

            // Cleanup
            return () => {
                newSocket.disconnect();
                console.log("socket disconnected frontend");
            };
        }
    }, [data]);

    // Watch for currentRoom changes and join the room when it changes
    useEffect(() => {
        if (socket && currentRoom) {
            console.log("Joining room:", currentRoom);
            socket.emit("join-room", currentRoom);
        }
    }, [socket, currentRoom]);

    return (
        <SocketContext.Provider value={contextValues}>
            {children}
        </SocketContext.Provider>
    );
};