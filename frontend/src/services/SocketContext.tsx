import { createContext, useContext } from 'react';
import { io, Socket } from 'socket.io-client';

const socket = io('http://localhost:3001');

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};