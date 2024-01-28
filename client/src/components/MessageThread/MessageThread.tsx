import React, { CSSProperties, useEffect, useRef } from "react";

import { Box, List, ListItem, TextField } from "@mui/material";
import { MessageThreadProps } from "../../types/messageTypes";

const MessageThread: React.FC<MessageThreadProps> = ({
  messages,
  onSendMessage,
}) => {
  const styles = useStyles();

  const [newMessage, setNewMessage] = React.useState("");
  const listRef = useRef<HTMLUListElement>(null);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Box>
      <List ref={listRef} style={styles.list}>
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

const useStyles = (): { [key: string]: CSSProperties } => ({
  list: {
    height: 300,
    marginBottom: "2%",
    overflowY: "auto",
  },
});
