import React, { useState, useEffect } from "react";

import { Message } from "../../types/messageTypes";
import MessageThread from "./MessageThread";

const MessageThreadContainer: React.FC<{
  roomId: string | undefined;
  username: string | undefined;
  socket: any;
}> = ({ roomId, username, socket }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (socket && roomId) {
      // Request existing room messages when component mounts
      socket.emit("getRoomMessages", { roomId });

      socket.on("roomMessages", (roomMessages: Message[]) => {
        setMessages(roomMessages);
      });

      socket.on("receiveMessage", (receivedMessage: Message) => {
        setMessages((prevMessages) => {
          // Skip duplicates: check if we already have this message by content and username
          const isDuplicate = prevMessages.some((msg) =>
            msg.message === receivedMessage.message &&
            msg.username === receivedMessage.username
          );

          if (isDuplicate) {
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
    if (messageContent.trim() && roomId && username) {
      const newMessage = {
        roomId,
        username,
        message: messageContent,
        timestamp: new Date(),
      };
      // Add message locally immediately for responsive UI
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      // Send to other users via socket
      socket?.emit("sendMessage", newMessage);
    }
  };

  return (
    <MessageThread messages={messages} onSendMessage={handleSendMessage} />
  );
};

export default MessageThreadContainer;
