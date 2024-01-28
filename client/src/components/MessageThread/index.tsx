import React, { useState, useEffect } from "react";

import { Message } from "../../types/messageTypes";
import MessageThread from "./MessageThread";
import useSocket from "../../services/useSocket";

const MessageThreadContainer: React.FC<{
  roomId: string | undefined;
  username: string | undefined;
}> = ({ roomId, username }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const socket = useSocket();

  useEffect(() => {
    if (socket) {
      socket.emit("joinRoom", roomId);

      socket.on("roomMessages", (roomMessages) => {
        setMessages(roomMessages);
      });

      socket.on("receiveMessage", (receivedMessage) => {
        setMessages((prevMessages) => {
          if (
            prevMessages.some(
              (msg) => msg.timestamp === receivedMessage.timestamp
            )
          ) {
            return prevMessages;
          }
          return [...prevMessages, receivedMessage];
        });
      });

      return () => {
        socket.off("receiveMessage");
        socket.off("roomMessages");
      };
    }
  }, [socket, roomId]);

  const handleSendMessage = (messageContent: string) => {
    if (messageContent.trim() && roomId && username) { // TODO: Eliminate all these checks
      const newMessage = {
        roomId,
        username,
        message: messageContent,
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      socket?.emit("sendMessage", newMessage);
    }
  };

  return (
    <MessageThread messages={messages} onSendMessage={handleSendMessage} />
  );
};

export default MessageThreadContainer;
