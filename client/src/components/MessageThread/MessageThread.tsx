import React from "react";

import { Box, List, ListItem, TextField, Button } from "@mui/material";
import { MessageThreadProps } from "../../types/messageTypes"; 

const MessageThread: React.FC<MessageThreadProps> = ({
  messages,
  onSendMessage,
}) => {
  const [newMessage, setNewMessage] = React.useState("");

  const handleSend = () => {
    onSendMessage(newMessage);
    setNewMessage("");
  };

  return (
    <Box>
      <List>
        {messages.map((msg, index) => (
          <ListItem key={index}>{msg.message}</ListItem>
        ))}
      </List>
      <TextField
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message"
        fullWidth
      />
      <Button onClick={handleSend}>Send</Button>
    </Box>
  );
};

export default MessageThread;
