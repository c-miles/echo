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
    <Box style={styles.container}>
      <List ref={listRef} style={styles.list}>
        {messages.map((msg, index) => (
          <ListItem key={index} style={styles.listItem}>
            {`${msg.username}: ${msg.message}`}
          </ListItem>
        ))}
      </List>
      <TextField
        fullWidth
        InputProps={{
          style: styles.input,
        }}
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
  container: {
    backgroundColor: "#424242",
    width: 300,
  },
  input: {
    color: "#FFFFFF",
  },
  list: {
    height: "calc(100vh - 178px)",
    marginBottom: "1%",
    overflowY: "auto",
  },
  listItem: {
    color: "#FFFFFF",
  },
});
