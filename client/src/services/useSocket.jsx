import { useEffect, useState } from "react";
import io from "socket.io-client";

const SERVER_URL = "http://localhost:3000";

const useSocket = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(SERVER_URL);
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  return socket;
};

export default useSocket;
