import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { API_BASE_URL, getSocketOptions, getStoredSession } from "../services/api";

const SocketContext = createContext({ socket: null, socketConnected: false });

export const SocketProvider = ({ children }) => {
  const { token } = getStoredSession();
  const [socket, setSocket] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    if (!token) {
      setSocket(null);
      setSocketConnected(false);
      return undefined;
    }

    const client = io(API_BASE_URL, getSocketOptions(token));
    const handleConnect = () => setSocketConnected(true);
    const handleDisconnect = () => setSocketConnected(false);
    setSocket(client);
    client.on("connect", handleConnect);
    client.on("disconnect", handleDisconnect);

    return () => {
      client.off("connect", handleConnect);
      client.off("disconnect", handleDisconnect);
      client.disconnect();
      setSocket(null);
      setSocketConnected(false);
    };
  }, [token]);

  return (
    <SocketContext.Provider value={{ socket, socketConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
