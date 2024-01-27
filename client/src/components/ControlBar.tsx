import React, { useState, CSSProperties } from "react";

import { Box, IconButton, AppBar } from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";

import { ControlBarProps } from "../types/controlBarTypes";

const ControlBar: React.FC<ControlBarProps> = ({ toggleMessageThread }) => {
  const styles = useControlBarStyles();

  const [isMessageThreadOpen, setIsMessageThreadOpen] = useState(false);

  const handleChevronClick = () => {
    setIsMessageThreadOpen(!isMessageThreadOpen);
    toggleMessageThread();
  };

  return (
    <AppBar position="static" style={styles.container}>
      <Box style={styles.box}>
        <IconButton onClick={handleChevronClick} style={styles.chevron}>
          {isMessageThreadOpen ? (
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
