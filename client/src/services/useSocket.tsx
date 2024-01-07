import React from "react";
import { Socket, io } from "socket.io-client";

const SERVER_URL = "http://localhost:3000";

const useSocket = (): Socket | null => {
  const [socket, setSocket] = React.useState<Socket | null>(null);

  React.useEffect(() => {
    const newSocket = io(SERVER_URL);
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return socket;
};

export default useSocket;
