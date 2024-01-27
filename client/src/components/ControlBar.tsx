import React, { useState, CSSProperties } from "react";

import { Box, IconButton, AppBar } from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";

type ControlBarProps = {
  toggleMessages: () => void;
};

const ControlBar: React.FC<ControlBarProps> = ({ toggleMessages }) => {
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const styles = useControlBarStyles();

  const handleChevronClick = () => {
    setIsMessagesOpen(!isMessagesOpen);
    toggleMessages();
  };

  return (
    <AppBar position="static" style={styles.container}>
      <Box style={styles.box}>
        <IconButton onClick={handleChevronClick} style={styles.chevron}>
          {isMessagesOpen ? (
            <KeyboardArrowDown style={styles.icon} />
          ) : (
            <KeyboardArrowUp style={styles.icon} />
          )}
        </IconButton>
      </Box>
    </AppBar>
  );
};

export default ControlBar;

const useControlBarStyles = (): { [key: string]: CSSProperties } => ({
  container: {
    backgroundColor: "#424242",
    bottom: 0,
    position: "fixed",
    width: "100%",
  },
  box: {
    display: "flex",
    justifyContent: "flex-end",
    width: "100%",
  },
  chevron: {
    marginRight: "2%",
  },
  icon: {
    color: "white",
  },
});
