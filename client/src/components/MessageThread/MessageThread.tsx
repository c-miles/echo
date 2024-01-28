import React from "react";

import { Box, List, ListItem, TextField } from "@mui/material";
import { MessageThreadProps } from "../../types/messageTypes";

const MessageThread: React.FC<MessageThreadProps> = ({
  messages,
  onSendMessage,
}) => {
  const [newMessage, setNewMessage] = React.useState("");

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  return (
    <Box>
      <List>
        {messages.map((msg, index) => (
          <ListItem key={index}>{msg.message}</ListItem>
        ))}
      </List>
      <TextField
        fullWidth
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message"
        value={newMessage}
      />
    </Box>
  );
};

export default MessageThread;
