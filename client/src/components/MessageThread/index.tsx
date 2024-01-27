import React, { useState, useEffect } from "react";

import { Message } from "../../types/messageTypes"; 
import MessageThread from "./MessageThread";
import useSocket from "../../services/useSocket";

const MessageThreadContainer: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const socket = useSocket();

  useEffect(() => {
    socket?.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket?.off("receiveMessage");
    };
  }, [socket]);

  const handleSendMessage = (message: string) => {
  };

  return (
    <MessageThread messages={messages} onSendMessage={handleSendMessage} />
  );
};

export default MessageThreadContainer;
