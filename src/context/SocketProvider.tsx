import React, { createContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { useAppSelector } from "../hooks/hooks";
import { RootState } from "../redux";

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

// const SOCKET_BACKEND_URL = import.meta.env.VITE_REACT_APP_SOCKET_BACKEND_URL;
const IS_LOCAL_ENV = import.meta.env.MODE === 'development';
const SOCKET_BACKEND_URL = IS_LOCAL_ENV?import.meta.env.VITE_REACT_APP_SOCKET_BACKEND_URL:import.meta.env.VITE_REACT_SOCKET_URL;

export const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const { data } = useAppSelector((state: RootState) => state.user);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<{ userId: string; socketId: string }[]>([]);
    const [currentRoom, setCurrentRoom] = useState<string>("");

    const contextValues: SocketContextType = {
        socket,
        onlineUsers,
        setOnlineUsers,
        currentRoom, 
        setCurrentRoom,
    };

    useEffect(() => {
        if ((data?.role === "student" || data?.role === "instructor") && SOCKET_BACKEND_URL) {
            // const transports = IS_LOCAL_ENV
            //     ? ['polling', 'websocket']  // locally
            //     : ['websocket'];            // production

                const newSocket: Socket = io("https://edusprint.shop", {
                    path: "/socket.io",
                    transports: ['websocket'],
                    query: {
                        userId: data._id
                    }
                });
                const ws = new WebSocket('wss://edusprint.shop/socket.io/');
                ws.onopen = () => console.log('Connected!');
                ws.onerror = (error) => console.log('Error: this is new erro for the socket host---->', error);

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