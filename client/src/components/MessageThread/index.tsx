import React, { useState, useEffect } from "react";

import { Message } from "../../types/messageTypes";
import MessageThread from "./MessageThread";
import useSocket from "../../services/useSocket";

const MessageThreadContainer: React.FC<{
  roomId: string | undefined;
  userId: string | undefined;
}> = ({ roomId, userId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const socket = useSocket();

  useEffect(() => {
    if (socket) {
      socket.emit("joinRoom", roomId);

      socket.on("roomMessages", (roomMessages) => {
        setMessages(roomMessages);
      });

      socket.on("receiveMessage", (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      return () => {
        socket.off("receiveMessage");
        socket.off("roomMessages");
      };
    }
  }, [socket, roomId]);

  const handleSendMessage = (messageContent: string) => {
    if (messageContent.trim()) {
      const message = { roomId, userId, message: messageContent };
      socket?.emit("sendMessage", message);
    }
  };

  return (
    <MessageThread messages={messages} onSendMessage={handleSendMessage} />
  );
};

export default MessageThreadContainer;
